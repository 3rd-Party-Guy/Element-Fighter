/// Author:         Nikolay Hadzhiev
/// Description:    An abstract class followed by all definitions of commands afterwards. Used to manage Input & Actions

export class Command {
    execute(entity) {
        return;
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
    }
};

export class JumpCommand extends Command {
    constructor() {
        super();
    }

    execute(entity) {
        entity.jump();
    }
}