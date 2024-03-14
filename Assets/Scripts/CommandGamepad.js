import PhysicsComponent from "./Components/PhysicsComponent.js";

export default class GamepadCommand {
    execute(player, data) {}

    onPressed() {}
    onReleased() {}
}

export class GamepadMoveHorizontalCommand {
    execute(player, data) {
        const physics_component = player.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;
        if (player.isAttacking) return;

        physics_component.vel.x += data * 150;
    }
}