/// Author:         Nikolay Hadzhiev
/// Description:    An abstract class followed by all definitions of commands afterwards. Used to manage Input & Actions

import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";

export default class Command {
    // some commands cannot be held down and should only function when pressed instead
    first_call = true;
    player = undefined;

    constructor(player) {
        this.player = player;
    }

    execute() {
        this.first_call = false;
    }

    onPressed() {}
    onReleased() {
        this.first_call = true;
    }
};

export class MoveCommand extends Command {
    xVel = 0;
    yVel = 0;

    constructor(player, xVel, yVel) {
        super(player);
        
        this.xVel = xVel;
        this.yVel = yVel;
    }

    execute() {
        const physics_component = this.player.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;
        if (this.player.isAttacking) return;

        physics_component.vel.x += this.xVel;
        physics_component.vel.y += this.yVel;
        
        super.execute();
    }
};

export class JumpCommand extends Command {
    execute() {
        if (this.player.isAttacking)
            return;

        if (this.first_call) {
            this.player.getComponentOfType(PhysicsComponent)?.jump();
        }

        super.execute();
    }

    onPressed() {
        this.player.is_jumping = true;
        super.onPressed();
    }

    onReleased() {
        this.player.is_jumping = false;
        super.onReleased();
    }
}

export class DuckCommand extends Command {
    execute() {
        if (this.player.isAttacking) return;
        if (this.first_call)
            this.player.getComponentOfType(PhysicsComponent)?.duck();

        super.execute();
    }

    onPressed() {
        this.player.is_ducking = true;
        super.onPressed();
    }

    onReleased() {
        this.player.is_ducking = false;
        super.onReleased();
    }
}

export class AttackLightCommand extends Command {
    execute() {
        if (this.first_call && this.player.attackState == 'none')
            this.player.attackLight();
        
        super.execute();
    }
}

export class AttackHeavyCommand extends Command {
    execute() {
        if (this.first_call && this.player.attackState == 'none')
            this.player.attackHeavy();

        super.execute();
    }
}

export class AbilityOneCommand extends Command {
    execute() {
        if (this.first_call && this.player.attackState == 'none')
            this.player.abilityOne();

        super.execute();
    }
}

export class AbilityTwoCommand extends Command {
    execute() {
        if (this.first_call && this.player.attackState == 'none')
            this.player.abilityTwo();

        super.execute();
    }
}