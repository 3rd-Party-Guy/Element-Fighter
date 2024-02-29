/// Author:         Nikolay Hadzhiev
/// Description:    An abstract class followed by all definitions of commands afterwards. Used to manage Input & Actions

import Entity from "./Entity.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import { AttackModes } from "./StateMachine.js";

export default class Command {
    // some commands cannot be held down and should only function when pressed instead
    first_call = true;

    execute(entity) {
        this.first_call = false;
    }

    onSet() {}
    onUnset() {
        this.first_call = true;
    }
};

export class MoveCommand extends Command {
    xVel = 0;
    yVel = 0;

    constructor(xVel, yVel) {
        super();
        
        this.xVel = xVel;
        this.yVel = yVel;
    }

    execute(entity) {
        const physics_component = entity.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;

        physics_component.vel.x += this.xVel;
        physics_component.vel.y += this.yVel;
        
        super.execute();
    }
};

export class JumpCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        if (this.first_call)
            entity.getComponentOfType(PhysicsComponent)?.jump();

        super.execute();
    }
}

export class DuckCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        if (this.first_call)
            entity.getComponentOfType(PhysicsComponent)?.duck();

        super.execute();
    }
}

export class AttackLightCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == AttackModes.None)
            player.attackLight();
        
        super.execute();
    }
}

export class AttackHeavyCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == AttackModes.None)
            player.attackHeavy();

        super.execute();
    }
}

export class AbilityOneCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == AttackModes.None)
            player.abilityOne();

        super.execute();
    }
}

export class AbilityTwoCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == AttackModes.None)
            player.abilityTwo();

        super.execute();
    }
}