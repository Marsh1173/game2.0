import { PlayerActor } from "../../../objects/Actors/Players/playerActor";
import { Vector } from "../../../vector";
import { Game } from "../../game";
import { ServerTalker } from "../../servertalker";
import { ClientPlayerActor } from "./clientPlayerActor";

export function onMouseDown(this: Game, e: MouseEvent) {
  if (e.button === 0) {
    //left mouse button click
    /*cancelAbilites(playerWithId);
    playerWithId.playerAbilities[0].isCharging = true;*/
    this.gamePlayer.actionsNextFrame.leftClick = true;

  } else if (e.button === 2) {
      /*cancelAbilites(playerWithId);
      playerWithId.playerAbilities[1].isCharging = true;*/
  }
}

export function onMouseUp(this: Game, e: MouseEvent) {
  if (e.button === 0) {
    // left mouse release
    //playerWithId.playerAbilities[0].isCharging = false;
  } else if (e.button === 2) {
      //playerWithId.playerAbilities[1].isCharging = false;
  }
}

export function onKeyDown(this: Game, e: KeyboardEvent) {
  /*if (e.code === this.config.playerKeys.firstAbility && !playerWithId.playerAbilities[2].isCharging) {
      cancelAbilites(playerWithId);
      playerWithId.playerAbilities[2].isCharging = true;
  } else if (e.code === this.config.playerKeys.secondAbility && !playerWithId.playerAbilities[3].isCharging) {
      cancelAbilites(playerWithId);
      playerWithId.playerAbilities[3].isCharging = true;
  } else if (e.code === this.config.playerKeys.thirdAbility && !playerWithId.playerAbilities[4].isCharging) {
      cancelAbilites(playerWithId);
      playerWithId.playerAbilities[4].isCharging = true;
  } else */this.keyState[e.code] = true;
}

export function onKeyUp(this: Game, e: KeyboardEvent) {
  /*if (e.code === this.config.playerKeys.firstAbility) {
    playerWithId.playerAbilities[2].isCharging = false;
  } else if (e.code === this.config.playerKeys.secondAbility) {
    playerWithId.playerAbilities[3].isCharging = false;
  } else if (e.code === this.config.playerKeys.thirdAbility) {
    playerWithId.playerAbilities[4].isCharging = false;
  } else */this.keyState[e.code] = false;
}

export function broadcastActions(this: ClientPlayerActor) {
  if(this.actionsNextFrame.jump) {
    this.serverTalker.sendMessage({
      type: "clientPlayerJump",
      id: this.id,
      position: this.position,
      momentum: this.momentum
    });
  }

  if(this.actionsNextFrame.moveRight != this.wasMovingRight) {
    if(this.actionsNextFrame.moveRight) {
      this.serverTalker.sendMessage({
        type: "clientPlayerMoveRight",
        id: this.id,
        position: this.position,
        momentum: this.momentum
      });
    } else {
      this.serverTalker.sendMessage({
        type: "clientPlayerStopMoveRight",
        id: this.id,
        position: this.position,
        momentum: this.momentum
      });
    }

    this.wasMovingRight = this.actionsNextFrame.moveRight;
  }

  if(this.actionsNextFrame.moveLeft != this.wasMovingLeft) {
    if(this.actionsNextFrame.moveLeft) {
      this.serverTalker.sendMessage({
        type: "clientPlayerMoveLeft",
        id: this.id,
        position: this.position,
        momentum: this.momentum
      });
    } else {
      this.serverTalker.sendMessage({
        type: "clientPlayerStopMoveLeft",
        id: this.id,
        position: this.position,
        momentum: this.momentum
      });
    }
    this.wasMovingLeft = this.actionsNextFrame.moveLeft;
  }

}


export interface ClientPlayerJump {
  type: "clientPlayerJump",
  id: number,
  position: Vector,
  momentum: Vector,
}

export interface ClientPlayerMoveRight {
  type: "clientPlayerMoveRight",
  id: number,
  position: Vector,
  momentum: Vector,
}

export interface ClientPlayerMoveLeft {
  type: "clientPlayerMoveLeft",
  id: number,
  position: Vector,
  momentum: Vector,
}

export interface ClientPlayerStopMoveRight {
  type: "clientPlayerStopMoveRight",
  id: number,
  position: Vector,
  momentum: Vector,
}

export interface ClientPlayerStopMoveLeft {
  type: "clientPlayerStopMoveLeft",
  id: number,
  position: Vector,
  momentum: Vector,
}