import { AllInfo } from "../api/allinfo";
import { ServerMessage } from "../api/message";
import { Config } from "../config";
import { Shape, Vector } from "../vector";
import { ServerTalker } from "./servertalker";
import { safeGetElementById } from "./util";
import { GameRenderer } from "./gameRender/gameRenderer";
import { findAngle, rotateShape } from "../findAngle";
import { handleMessage, findActor } from "./messageHandler";
import { ClientPlayer } from "../objects/newActors/clientActors/clientPlayer/clientPlayer";
import { ClientSword } from "../objects/newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { ClientFloor } from "../objects/terrain/floor/clientFloor";
import { SerializedPlayer } from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { InputReader } from "../objects/clientControllers/inputReader";
import { ifInside } from "../ifInside";
import { ClientDoodad } from "../objects/terrain/doodads/clientDoodad";
import { Doodad } from "../objects/terrain/doodads/doodad";
import { ClientHammer } from "../objects/newActors/clientActors/clientPlayer/clientClasses/clientHammer";
import { ClientDaggers } from "../objects/newActors/clientActors/clientPlayer/clientClasses/clientDaggers";
import { Floor } from "../objects/terrain/floor/floor";
import { ClientActor, renderShape } from "../objects/newActors/clientActors/clientActor";
import { SwordController } from "../objects/clientControllers/controllers/swordController";
import { DaggersController } from "../objects/clientControllers/controllers/daggersController";
import { HammerController } from "../objects/clientControllers/controllers/hammerController";
import { SideType } from "../objects/newActors/clientActors/model/healthBar";
import { ParticleSystem } from "./particles/particleSystem";

export class Game {
    private static readonly menuDiv = safeGetElementById("menuDiv");
    private static readonly gameDiv = safeGetElementById("gameDiv");

    protected gameRenderer: GameRenderer;
    protected gamePlayer: ClientPlayer;
    protected gamePlayerInputReader: InputReader;

    protected readonly globalClientActors: GlobalClientActors = {
        actors: [],
        players: [],
        daggerPlayers: [],
        hammerPlayers: [],
        swordPlayers: [],
    };
    protected readonly globalClientObjects: GlobalClientObjects;

    protected readonly particleSystem: ParticleSystem;

    public static particleAmount: number;
    private going: boolean = false;

    public screenPos: Vector = { x: 0, y: 0 };
    public mousePos: Vector = { x: 0, y: 0 };

    private handleMessage = handleMessage;
    protected findActor = findActor;

    protected constructGame(info: AllInfo) {
        /*this.groundPlatform = new ClientGroundPlatform(info.groundPlatform);
        this.platforms = info.platforms.map((platformInfo) => new ClientPlatform(this.config, platformInfo));
        this.playerActors = info.playerActors.map(
            (playerInfo) => new ClientPlayerActor(this.config, playerInfo, this.id === playerInfo.id ? true : false, this.serverTalker),
        );*/
    }

    constructor(
        info: AllInfo,
        protected readonly config: Config,
        protected readonly id: number,
        public readonly serverTalker: ServerTalker,
        particleAmount: number,
    ) {
        Game.particleAmount = particleAmount / 100;

        // CONSTRUCT GAME
        let actorCanvas = safeGetElementById("actorCanvas") as HTMLCanvasElement;
        let actorCtx = actorCanvas.getContext("2d")!;

        this.particleSystem = new ParticleSystem(actorCtx, this);

        this.globalClientObjects = {
            floor: new ClientFloor(this, info.floor.pointsAndAngles, info.floor.pointCount, info.floor.resultWidth, actorCtx),
            doodads: [],
        };
        info.doodads.forEach((doodad) => {
            this.globalClientObjects.doodads.push(new ClientDoodad(doodad.position, doodad.rotation, doodad.type, actorCtx));
        });

        info.players.forEach((playerInfo) => {
            if (playerInfo.id !== this.id) {
                this.newClientPlayer(playerInfo);
            }
        });

        let gamePlayerInfo: SerializedPlayer = info.players.find((player) => player.id === this.id)!;
        this.gamePlayer = this.makeGamePlayer(gamePlayerInfo);

        this.gamePlayerInputReader = new InputReader(this.gamePlayer, this);

        this.gameRenderer = new GameRenderer(this.config, this, this.gamePlayer, this.screenPos);

        this.serverTalker.messageHandler = (msg: ServerMessage) => this.handleMessage(msg);
    }

    public start() {
        this.going = true;

        // use onkeydown and onkeyup instead of addEventListener because it's possible to add multiple event listeners per event
        // This would cause a bug where each time you press a key it creates multiple blasts or jumps

        //let positionDifference: Vector = this.gamePlayer.position;
        window.onmousedown = (e: MouseEvent) => {
            /*console.log(
                "{x: " +
                    (-this.screenPos.x + this.mousePos.x - positionDifference.x) +
                    ", y: " +
                    (-this.screenPos.y + this.mousePos.y - positionDifference.y) +
                    "},",
            );*/
            this.gamePlayerInputReader.registerMouseDown(e, this.getGlobalMousePos());
        };
        window.onmouseup = (e: MouseEvent) => this.gamePlayerInputReader.registerMouseUp(e, this.getGlobalMousePos());
        window.onkeydown = (e: KeyboardEvent) => this.gamePlayerInputReader.registerKeyDown(e, this.getGlobalMousePos());
        window.onkeyup = (e: KeyboardEvent) => this.gamePlayerInputReader.registerKeyUp(e, this.getGlobalMousePos());

        window.onmousemove = (e: MouseEvent) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        };

        window.requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

    public end() {
        this.going = false;
        this.serverTalker.leave();

        window.onmousedown = () => {};
        window.onmouseup = () => {};
        window.onkeydown = () => {};
        window.onkeyup = () => {};
        window.onmousemove = () => {};
    }

    private lastFrame?: number;
    public loop(timestamp: number) {
        if (!this.lastFrame) {
            this.lastFrame = timestamp;
        }
        const elapsedTime = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;
        this.update(elapsedTime * this.config.gameSpeed);
        if (this.going) {
            window.requestAnimationFrame((timestamp) => this.loop(timestamp));
        }
    }

    private update(elapsedTime: number) {
        this.updateObjects(elapsedTime);

        this.gameRenderer.updateAndRender(elapsedTime);

        this.globalClientObjects.doodads.forEach((doodad) => {
            if (doodad.ifShouldRender(this.gameRenderer.previousWindowSize, this.screenPos)) {
                doodad.render();
            }
        });
        this.globalClientObjects.floor.render(this.screenPos, this.gameRenderer.previousWindowSize);
        this.globalClientActors.players.forEach((player) => {
            if (player.getActorId() !== this.id) player.render();
        });
        this.gamePlayer.render();
        this.globalClientActors.players.forEach((player) => {
            if (player.getActorId() !== this.id) player.renderHealth();
        });
        this.gamePlayer.renderHealth();

        this.particleSystem.updateAndRender(elapsedTime);

        this.gamePlayerInputReader.update(elapsedTime);
    }

    private updateObjects(elapsedTime: number) {
        this.globalClientActors.players.forEach((player) => player.update(elapsedTime));
    }

    protected newClientPlayer(playerInfo: SerializedPlayer) {
        var newPlayer: ClientPlayer;
        switch (playerInfo.class) {
            case "daggers":
                newPlayer = new ClientDaggers(this, playerInfo);
                this.globalClientActors.daggerPlayers.push(newPlayer as ClientDaggers);
                break;
            case "hammer":
                newPlayer = new ClientHammer(this, playerInfo);
                this.globalClientActors.hammerPlayers.push(newPlayer as ClientHammer);
                break;
            case "sword":
                newPlayer = new ClientSword(this, playerInfo);
                this.globalClientActors.swordPlayers.push(newPlayer as ClientSword);
                break;
            default:
                throw new Error("unknown class type " + playerInfo.class);
        }
        this.globalClientActors.players.push(newPlayer);
        this.globalClientActors.actors.push(newPlayer);
    }

    protected makeGamePlayer(playerInfo: SerializedPlayer): ClientPlayer {
        var newGamePlayer: ClientPlayer;
        switch (playerInfo.class) {
            case "daggers":
                newGamePlayer = new ClientDaggers(this, playerInfo);
                this.globalClientActors.daggerPlayers.push(newGamePlayer as ClientDaggers);
                break;
            case "hammer":
                newGamePlayer = new ClientHammer(this, playerInfo);
                this.globalClientActors.hammerPlayers.push(newGamePlayer as ClientHammer);
                break;
            case "sword":
                newGamePlayer = new ClientSword(this, playerInfo);
                this.globalClientActors.swordPlayers.push(newGamePlayer as ClientSword);
                break;
            default:
                throw new Error("unknown class type " + playerInfo.class);
        }
        this.globalClientActors.players.push(newGamePlayer);
        this.globalClientActors.actors.push(newGamePlayer);
        return newGamePlayer;
    }

    protected playerLeave(id: number) {
        let player: ClientPlayer = this.globalClientActors.players.find((player) => player.getActorId() === id)!;
        switch (player.getClassType()) {
            case "daggers":
                this.globalClientActors.daggerPlayers = this.globalClientActors.daggerPlayers.filter((player) => player.getActorId() !== id);
                break;
            case "sword":
                this.globalClientActors.swordPlayers = this.globalClientActors.swordPlayers.filter((player) => player.getActorId() !== id);
                break;
            case "hammer":
                this.globalClientActors.hammerPlayers = this.globalClientActors.hammerPlayers.filter((player) => player.getActorId() !== id);
                break;
            default:
                throw new Error("unknown class type in playerLeave");
        }
        this.globalClientActors.players = this.globalClientActors.players.filter((player) => player.getActorId() !== id);
        this.globalClientActors.actors = this.globalClientActors.actors.filter((actor) => actor.getActorId() !== id);
    }
    protected getMouseShape(): Shape {
        let p1: Vector = { x: this.mousePos.x - this.screenPos.x, y: this.mousePos.y - 40 - this.screenPos.y };
        let p2: Vector = { x: this.mousePos.x - 30 - this.screenPos.x, y: this.mousePos.y + 20 - this.screenPos.y };
        let p3: Vector = { x: this.mousePos.x + 30 - this.screenPos.x, y: this.mousePos.y + 20 - this.screenPos.y };
        return {
            center: { x: this.mousePos.x - this.screenPos.x, y: this.mousePos.y - this.screenPos.y },
            points: [p1, p2, p3],
            edges: [
                { p1, p2 },
                { p1: p2, p2: p3 },
                { p1: p3, p2: p1 },
            ],
        };
    }
    public getGlobalMousePos(): Vector {
        return { x: this.mousePos.x - this.screenPos.x, y: this.mousePos.y - this.screenPos.y };
    }

    public getGlobalObjects(): GlobalClientObjects {
        return this.globalClientObjects;
    }
    public getGlobalActors(): GlobalClientActors {
        return this.globalClientActors;
    }
    public getActorCtx(): CanvasRenderingContext2D {
        return (safeGetElementById("actorCanvas") as HTMLCanvasElement).getContext("2d")!;
    }
    public getActorSide(team: number): SideType {
        if (team === this.id) return "self";
        else return "enemy";
    }
}

export interface GlobalObjects {
    floor: Floor;
    doodads: Doodad[];
}

export interface GlobalClientActors {
    actors: ClientActor[];
    players: ClientPlayer[];
    daggerPlayers: ClientDaggers[];
    hammerPlayers: ClientHammer[];
    swordPlayers: ClientSword[];
}

export interface GlobalClientObjects extends GlobalObjects {
    floor: ClientFloor;
    doodads: ClientDoodad[];
}
