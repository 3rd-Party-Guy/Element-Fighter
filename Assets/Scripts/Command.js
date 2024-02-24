/// Author:         Nikolay Hadzhiev
/// Description:    An abstract class followed by all definitions of commands afterwards. Used to manage Input & Actions

import Entity from "./Entity.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";

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
        entity.getComponentOfType(PhysicsComponent).vel.x += this.xVel;
        entity.getComponentOfType(PhysicsComponent).vel.y += this.yVel;
        super.execute();
    }
};

export class JumpCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        if (this.first_call)
            entity.getComponentOfType(PhysicsComponent).jump();

        super.execute();
    }
}

export class DuckCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        if (this.first_call)
            entity.getComponentOfType(PhysicsComponent).duck();

            super.execute();
    }
}