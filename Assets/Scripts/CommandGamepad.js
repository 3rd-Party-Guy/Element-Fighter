import PhysicsComponent from "./Components/PhysicsComponent.js";

export default class GamepadCommand {
    execute(entity, data) {}
}

export class GamepadMoveHorizontalCommand {
    execute(entity, data) {
        const physics_component = entity.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;

        physics_component.vel.x += data * 150;
    }
}

export class GamepadJumpCommand {
    execute(entity, data) {
        entity.getComponentOfType(PhysicsComponent)?.jump();
    }
}

export class GamepadDuckCommand {
    execute(entity, data) {
        entity.getComponentOfType(PhysicsComponent)?.duck();
    }
}