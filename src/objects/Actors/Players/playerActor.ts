import { Config } from "../../../config";
import { Vector } from "../../../vector";
import { Platform } from "../../platform";
import { Actor, ActorType } from "../actor";
import { checkPlayerActorCollision, dampenMomentum } from "./playerActorSpatialFunctions";
import { attemptJump, attemptLeftClick, attemptMoveLeft, attemptMoveRight, jump, moveLeft, moveRight, performActions } from "./playerActorActionFunctions";
import { findAngle } from "../../../findAngle";
import { GroundPlatform } from "../../groundPlatform";
import { basicDistanceHitBox, basicOneDHitBox, basicThreeDHitBox, basicTwoDHitBox } from "../actorSpatialFunctions";
import e = require("express");

export type WeaponType = "sword" | "none";
export type PlayerActionType = "jump" | "moveLeft" | "moveRight" | "leftClick" | "rightClick" | "shift";
export type PlayerEffectType = "stunned";

export abstract class PlayerActor extends Actor {
    public actionsNextFrame: Record<PlayerActionType, boolean> = {
        jump: false,
        moveLeft: false,
        moveRight: false,
        leftClick: false,
        rightClick: false,
        shift: false,
    };

    protected maxSidewaysMomentum: number = 600;
    protected standingSidewaysAcceleration: number = 10000;
    protected fallingSidewaysAcceleration: number = 4000;
    protected jumpHeight: number = 1000;
    protected alreadyJumped: number = 0;

    constructor(
        public readonly config: Config,
        public readonly id: number,
        public position: Vector,
        public team: number,
        public color: string,
        public name: string,
        protected health: number,
        public focusAngle: number,
        protected weapon: WeaponType,
    ) {
        //config, id, position, team, health, maxHealth, deathTime, mass, size
        super(config, id, position, team, health, 100, 3, 1, { width: 46, height: 50 });
    }

    protected attemptJump = attemptJump;
    protected jump = jump;
    protected attemptMoveLeft = attemptMoveLeft;
    protected moveLeft = moveLeft;
    protected attemptMoveRight = attemptMoveRight;
    protected moveRight = moveRight;

    protected attemptLeftClick = attemptLeftClick;

    protected abstract leftClick(players: PlayerActor[]): void;

    public getActorType(): ActorType {
        return "player";
    }

    protected die() {
        //implement stopActions
        this.actionsNextFrame.jump = false;
        this.actionsNextFrame.moveLeft = false;
        this.actionsNextFrame.moveRight = false;
        super.die();
    }

    public resurrect(position: Vector) {
        this.health = this.maxHealth + 0;
        this.position.x = position.x + 0;
        this.position.y = position.y + 0;
        this.actorDeathData.isDead = false;
        this.actorDeathData.counter = 0;
    }

    private attemptPlayerCollision(players: PlayerActor[], elapsedTime: number) {
        if (this.checkIfAlive()) {
            players.forEach((player) => {
                if (player.id != this.id && player.checkIfAlive()) this.checkPlayerActorCollision(player, elapsedTime);
            });
        }
    }

    protected attemptGroundCollision(groundPlatform: GroundPlatform, elapsedTime: number) {
        if (this.updateStats.ifGroundCollision) groundPlatform.checkActorGroundCollision(this, elapsedTime);
    }

    private checkPlayerActorCollision = checkPlayerActorCollision;
    private dampenMomentum = dampenMomentum;
    protected updateAbilities() {}

    public changeFocusPositionAngle(angle: number) {
        this.focusAngle = angle + 0;
    }

    private attemptPerformActions(elapsedTime: number, players: PlayerActor[]) {
        if (this.checkIfAlive()) {
            this.performActions(elapsedTime, players);
        }
    }
    private performActions = performActions;

    protected updatePlayerActor(elapsedTime: number, platforms: Platform[], groundPlatform: GroundPlatform, players: PlayerActor[]) {
        this.resetUpdateStats();
        this.updateEffects(elapsedTime);

        this.dampenMomentum(elapsedTime);
        if (this.standing) {
            this.alreadyJumped = 0;
        }
        //update abilites/effects

        this.attemptPerformActions(elapsedTime, players);

        this.standing = false;

        this.attemptRegisterGravity(elapsedTime);
        this.attemptPlayerCollision(players, elapsedTime);
        this.attemptCheckRectangleCollision(elapsedTime, platforms);
        this.attemptGroundCollision(groundPlatform, elapsedTime);
        this.checkSideCollision(elapsedTime);

        this.updatePosition(elapsedTime);
        super.update(elapsedTime);
    }
}
