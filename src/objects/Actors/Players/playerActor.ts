import { Config } from "../../../config";
import { Vector } from "../../../vector";
import { Platform } from "../../platform";
import { Actor, ActorEffects } from "../actor";
import { checkPlayerActorCollision, dampenMomentum } from "./playerActorSpatialFunctions";
import { attemptJump, attemptMoveLeft, attemptMoveRight, jump, moveLeft, moveRight, performActions } from "./playerActorActionFunctions";

export type PlayerActionTypes = "jump" | "moveLeft" | "moveRight" | "leftClick" | "rightClick" | "shift";
export type PlayerEffectTypes = "stunned";

export abstract class PlayerActor extends Actor {

    protected playerEffects: Record<PlayerEffectTypes, number> = {
        stunned: 0,
    }

    public actionsNextFrame: Record<PlayerActionTypes, boolean> = {
        jump: false,
        moveLeft: false,
        moveRight: false,
        leftClick: false,
        rightClick: false,
        shift: false
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
        protected color: string,
        public name: string,
        public health: number = 100,
    ) {
        super(config, id, position, team, health);

        this.size = {"width": 46, "height": 50};
    }


    protected attemptJump = attemptJump;
    protected jump = jump;
    protected attemptMoveLeft = attemptMoveLeft;
    protected moveLeft = moveLeft;
    protected attemptMoveRight = attemptMoveRight;
    protected moveRight = moveRight;

    private checkPlayerActorCollision = checkPlayerActorCollision;
    private dampenMomentum = dampenMomentum;
    protected updateAbilities() {

    }

    private performActions = performActions;


    protected updatePlayerActor(elapsedTime: number, platforms: Platform[], players: PlayerActor[]) {

        this.dampenMomentum(elapsedTime); 
        if(this.standing){
            this.alreadyJumped = 0;
        }
        //update abilites/effects


        this.performActions(elapsedTime);

        this.standing = false;
        
        this.registerGravity(elapsedTime);
        players.forEach((player) => {
            if (player.id != this.id) this.checkPlayerActorCollision(player, elapsedTime);
        })
        platforms.forEach((platform) => {
            this.checkRectangleCollision(elapsedTime, platform);
        })
        this.checkSideCollision(elapsedTime);
        
    

        super.update(elapsedTime);


        this.actionsNextFrame.jump = false;
        //this.actionsNextFrame.leftClick = false;
        //this.actionsNextFrame.rightClick = false;
    }

}