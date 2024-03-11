/// Author:         Nikolay Hadzhiev
/// Description:    An abstract class followed by all definitions of commands afterwards. Used to manage Input & Actions

import PhysicsComponent from "./Components/PhysicsComponent.js";

export default class Command {
    // some commands cannot be held down and should only function when pressed instead
    first_call = true;

    execute(player) {
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

    constructor(xVel, yVel) {
        super();
        
        this.xVel = xVel;
        this.yVel = yVel;
    }

    execute(player) {
        const physics_component = player.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;
        if (player.isAttacking) return;

        physics_component.vel.x += this.xVel;
        physics_component.vel.y += this.yVel;
        
        super.execute();
    }
};

export class JumpCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (player.isAttacking)
            return;

        if (this.first_call)
            player.getComponentOfType(PhysicsComponent)?.jump();

        super.execute();
    }
}

export class DuckCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (player.isAttacking) return;
        if (this.first_call)
            player.getComponentOfType(PhysicsComponent)?.duck();

        super.execute();
    }
}

export class AttackLightCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == 'none')
            player.attackLight();
        
        super.execute();
    }
}

export class AttackHeavyCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == 'none')
            player.attackHeavy();

        super.execute();
    }
}

export class AbilityOneCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == 'none')
            player.abilityOne();

        super.execute();
    }
}

export class AbilityTwoCommand extends Command {
    constructor() {
        super();
    }

    execute(player) {
        if (this.first_call && player.attackState == 'none')
            player.abilityTwo();

        super.execute();
    }
}