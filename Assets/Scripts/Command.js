/// Author:         Nikolay Hadzhiev
/// Description:    An abstract class followed by all definitions of commands afterwards. Used to manage Input & Actions

export class Command {
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
        entity.xVel += this.xVel;
        entity.yVel += this.yVel;

        super.execute();
    }
};

export class JumpCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        if (this.first_call)
            entity.jump();

        super.execute();
    }
}

export class DuckCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        if (this.first_call)
            entity.duck();

            super.execute();
    }
}