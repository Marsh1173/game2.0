import { AllInfo } from "../api/allinfo";
import { ServerMessage } from "../api/message";
import { Config } from "../config";
import { Vector } from "../vector";
import { ClientPlatform } from "./platforms/platform";
import { ServerTalker } from "./servertalker";
import { safeGetElementById } from "./util";
import { GameRenderer } from "./gameRender/gameRenderer";
import { ClientPlayerActor } from "./clientActors/clientPlayers/clientPlayerActor";
import { assignDamageToActorArray, assignFocusUpdates, killActorArray } from "../objects/Actors/actorCombatFunctions";
import { findAngle } from "../findAngle";
import { handleMessage } from "./messageHandler";
import { ClientGroundPlatform } from "./platforms/groundPlatform";
import { ClientPlayer } from "../object/newActors/clientActors/clientPlayer/clientPlayer";
import { ClientSword } from "../object/newActors/clientActors/clientPlayer/clientClasses/clientSword";
import { ClientFloor } from "../object/terrain/floor/clientFloor";
import { SerializedPlayer } from "../object/newActors/serverActors/serverPlayer/serverPlayer";
import { Controller } from "../object/newActors/clientActors/clientControllers/controller";

export class Game {
    private static readonly menuDiv = safeGetElementById("menuDiv");
    private static readonly gameDiv = safeGetElementById("gameDiv");

    protected gameRenderer: GameRenderer;
    protected gamePlayer: ClientPlayer;
    protected gamePlayerController: Controller;

    public players: ClientPlayer[] = [];

    public static particleAmount: number;
    protected readonly keyState: Record<string, boolean> = {};
    private going: boolean = false;

    private screenPos: Vector = { x: 0, y: 0 };
    private mousePos: Vector = { x: 0, y: 0 };

    private handleMessage = handleMessage;

    protected floor: ClientFloor;

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

        this.floor = new ClientFloor(info.floor.pointsAndAngles, info.floor.pointCount, info.floor.resultWidth, actorCtx);

        this.players = info.players.map((playerInfo) => this.newClientPlayer(playerInfo, actorCtx, this.floor));
        this.gamePlayer = this.findPlayer();
        this.gamePlayerController = new Controller(this.gamePlayer, this);

        this.gameRenderer = new GameRenderer(this.config, this, this.gamePlayer, this.screenPos);

        this.serverTalker.messageHandler = (msg: ServerMessage) => this.handleMessage(msg);

        // use onkeydown and onkeyup instead of addEventListener because it's possible to add multiple event listeners per event
        // This would cause a bug where each time you press a key it creates multiple blasts or jumps
        window.onmousedown = (e: MouseEvent) => this.gamePlayerController.registerMouseDown(e);
        window.onmouseup = (e: MouseEvent) => this.gamePlayerController.registerMouseUp(e);
        window.onkeydown = (e: KeyboardEvent) => this.gamePlayerController.registerKeyDown(e);
        window.onkeyup = (e: KeyboardEvent) => this.gamePlayerController.registerKeyUp(e);

        window.onmousemove = (e: MouseEvent) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        };
    }

    public start() {
        this.going = true;
        window.requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

    public end() {
        this.going = false;
        this.serverTalker.leave();
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
        elapsedTime = Math.min(0.03, elapsedTime); //fix to make sure sudden lag spikes dont clip them through the floors\

        this.gamePlayerController.updateGamePlayerActions();

        this.updateObjects(elapsedTime);

        this.gameRenderer.updateAndRender(elapsedTime);

        this.floor.render();
    }

    private findPlayer() {
        const playerWithId = this.players.find((player) => player.getActorId() === this.id);
        if (!playerWithId) {
            throw new Error("Player with my id does not exist in data from server");
        }
        return playerWithId;
    }

    private updateObjects(elapsedTime: number) {
        this.players.forEach((player) => player.update(elapsedTime));
    }

    protected newClientPlayer(playerInfo: SerializedPlayer, actorCtx: CanvasRenderingContext2D, floor: ClientFloor): ClientPlayer {
        switch (playerInfo.class) {
            case "sword":
                return new ClientSword(
                    playerInfo.id,
                    playerInfo.position,
                    playerInfo.momentum,
                    playerInfo.health,
                    actorCtx,
                    floor,
                    playerInfo.color,
                    playerInfo.name,
                );
            default:
                throw new Error("unknown class type");
        }
    }
}
