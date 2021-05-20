import { AllInfo } from "../api/allinfo";
import { ClientMessage, InfoMessage, PlayerLeavingMessage, ServerMessage } from "../api/message";
import { Vector } from "../vector";
import { Config } from "../config";
import { ServerFloor } from "../objects/terrain/floor/serverFloor";
import { ClassType, ServerPlayer } from "../objects/newActors/serverActors/serverPlayer/serverPlayer";
import { ServerSword } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverSword";
import { defaultActorConfig } from "../objects/newActors/actorConfig";
import { ServerDoodad } from "../objects/terrain/doodads/serverDoodad";
import { ServerDaggers } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverDaggers";
import { ServerHammer } from "../objects/newActors/serverActors/serverPlayer/serverClasses/serverHammer";
import { GlobalObjects } from "../client/game";
import { ServerActor } from "../objects/newActors/serverActors/serverActor";
import { ActorType } from "../objects/newActors/actor";
import { playerModelConfig } from "../objects/newActors/clientActors/model/playerModels/playerModel";

export class Game {
    private intervalId?: NodeJS.Timeout;
    private static readonly REFRESH_RATE = 16;

    protected globalServerActors: GlobalServerActors = {
        actors: [],
        players: [],
        swordPlayers: [],
        daggerPlayers: [],
        hammerPlayers: [],
    };
    //public players: ServerPlayer[] = [];
    private readonly floor: ServerFloor = new ServerFloor(this.config.xSize, this.config.ySize);
    private readonly doodads: ServerDoodad[] = [];

    public static readonly clientMap: Record<number, (message: ServerMessage) => void> = {};
    public static broadcastMessage(msg: ServerMessage) {
        Object.values(Game.clientMap).forEach((sendFunction) => {
            sendFunction(msg);
        });
    }
    public static privateMessage(msg: ServerMessage, clientId: number) {
        Game.clientMap[clientId](msg);
    }

    constructor(public readonly config: Config) {
        this.doodads.push(new ServerDoodad({ x: 1000, y: this.floor.getYCoordAndAngle(1000).yCoord - 140 }, 0, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 1400, y: this.floor.getYCoordAndAngle(1000).yCoord - 290 }, 0, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 1800, y: this.floor.getYCoordAndAngle(1000).yCoord - 440 }, 0, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 2700, y: this.floor.getYCoordAndAngle(2700).yCoord }, 2.2, "rockLarge"));
        this.doodads.push(new ServerDoodad({ x: 3500, y: this.floor.getYCoordAndAngle(3500).yCoord }, 0, "rockLarge"));
    }

    public start() {
        this.intervalId = setInterval(() => {
            this.loop(Date.now());
        }, Game.REFRESH_RATE);
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        } else {
            throw new Error("Tried to stop a game that was not in progress");
        }
    }

    public allInfo(): AllInfo {
        return {
            players: this.globalServerActors.players.map((player) => player.serialize()),
            floor: this.floor.serialize(),
            doodads: this.doodads.map((doodad) => doodad.serialize()),
        };
    }

    private lastFrame?: number;
    public loop(timestamp: number) {
        if (!this.lastFrame) {
            this.lastFrame = timestamp;
        }
        const elapsedTime = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;
        this.update(elapsedTime * this.config.gameSpeed);
    }

    public update(elapsedTime: number) {
        if (this.globalServerActors.actors.length === 0) {
            return;
        }

        this.updateActors(elapsedTime);
    }

    private updateActors(elapsedTime: number) {
        this.globalServerActors.actors.forEach((actor) => actor.update(elapsedTime));
    }

    public newPlayer(id: number, name: string, color: string, team: number, classType: ClassType, classLevel: number, classSpec: number) {
        //adding conditions  to prevent errors
        if (classLevel < 1 || classLevel > 10) {
            classLevel = 0;
        }
        if (classLevel < 3 || classSpec > 2) {
            classSpec = 0;
        }

        let newPlayer: ServerPlayer;
        switch (classType) {
            case "sword":
                newPlayer = new ServerSword(this, id, color, name, classLevel, classSpec);
                this.globalServerActors.swordPlayers.push(newPlayer as ServerSword);
                break;
            case "daggers":
                newPlayer = new ServerDaggers(this, id, color, name, classLevel, classSpec);
                this.globalServerActors.daggerPlayers.push(newPlayer as ServerDaggers);
                break;
            case "hammer":
                newPlayer = new ServerHammer(this, id, color, name, classLevel, classSpec);
                this.globalServerActors.hammerPlayers.push(newPlayer as ServerHammer);
                break;
            default:
                throw new Error("unknown player class type " + classType);
        }
        this.globalServerActors.actors.push(newPlayer);
        this.globalServerActors.players.push(newPlayer);

        Game.broadcastMessage({
            type: "playerJoin",
            playerInfo: {
                id,
                class: classType,
                position: defaultActorConfig.playerStart,
                momentum: { x: 0, y: 0 },
                healthInfo: { health: newPlayer.getHealth(), maxHealth: newPlayer.getMaxHealth() },
                name,
                color,
                classLevel,
                classSpec,
            },
        });
    }

    public removePlayer(id: number) {
        let player: ServerPlayer = this.globalServerActors.players.find((player) => player.getActorId() === id)!;
        switch (player.getClassType()) {
            case "daggers":
                this.globalServerActors.daggerPlayers = this.globalServerActors.daggerPlayers.filter((player) => player.getActorId() !== id);
                break;
            case "sword":
                this.globalServerActors.swordPlayers = this.globalServerActors.swordPlayers.filter((player) => player.getActorId() !== id);
                break;
            case "hammer":
                this.globalServerActors.hammerPlayers = this.globalServerActors.hammerPlayers.filter((player) => player.getActorId() !== id);
                break;
            default:
                throw new Error("unknown class type in playerLeave");
        }
        this.globalServerActors.players = this.globalServerActors.players.filter((player) => player.getActorId() !== id);
        this.globalServerActors.actors = this.globalServerActors.actors.filter((actor) => actor.getActorId() !== id);

        Game.broadcastMessage({
            type: "playerLeave",
            id,
        });
    }

    public handleMessage(id: number, data: ClientMessage) {
        var player;
        switch (data.type) {
            case "clientPlayerAction":
                Game.broadcastMessage({
                    type: "serverPlayerAction",
                    actionType: data.actionType,
                    starting: data.starting,
                    playerId: data.playerId,
                    position: data.position,
                    momentum: data.momentum,
                });
                player = this.globalServerActors.players.find((player) => player.getActorId() === data.playerId);
                if (player) {
                    player.updatePositionAndMomentum(data.momentum, data.position);
                    player.actionsNextFrame[data.actionType] = data.starting;
                }
                break;
            case "clientPlayerFacingUpdate":
                Game.broadcastMessage({
                    type: "playerChangeFacing",
                    id: data.playerid,
                    facingRight: data.facingRight,
                });
                break;
            case "clientSwordMessage":
                let swordPlayer: ServerSword | undefined = this.globalServerActors.swordPlayers.find((player) => player.getActorId() === data.msg.originId);
                switch (data.msg.type) {
                    case "clientSwordWhirlwindHit":
                        if (swordPlayer) swordPlayer.assignWhirlwindDamage(data.msg.actors);
                        break;
                    case "clientSwordSlashHit":
                        if (swordPlayer) swordPlayer.assignSlashDamage(data.msg.actors);
                        break;
                    case "clientSwordAbility":
                        if (swordPlayer) swordPlayer.performServerAbility(data.msg.abilityType, data.msg.starting, data.msg.mousePos);
                        break;

                    default:
                        throw new Error(`Invalid clientSwordMessage type`);
                }
                break;
            default:
                throw new Error(`Invalid client message type`);
        }
    }

    public findActor(actorId: number, type: ActorType): ServerActor | undefined {
        switch (type) {
            case "daggersPlayer":
                return this.globalServerActors.daggerPlayers.find((player) => player.getActorId() === actorId)!;
            case "hammerPlayer":
                return this.globalServerActors.hammerPlayers.find((player) => player.getActorId() === actorId)!;
            case "swordPlayer":
                return this.globalServerActors.swordPlayers.find((player) => player.getActorId() === actorId)!;
            case "testMob":
                throw new Error("Test mobs have not been implemented in findActor");
            default:
                throw new Error(`Invalid actor type in findActor ` + type + ` with id ` + actorId);
        }
    }

    public getGlobalObjects(): GlobalObjects {
        return {
            floor: this.floor,
            doodads: this.doodads,
        };
    }

    public getGlobalServerActors(): GlobalServerActors {
        return this.globalServerActors;
    }
}

export interface GlobalServerActors {
    actors: ServerActor[];
    players: ServerPlayer[];
    swordPlayers: ServerSword[];
    daggerPlayers: ServerDaggers[];
    hammerPlayers: ServerHammer[];
}
