import PhysicsComponent from "./Components/PhysicsComponent.js";

// Commands specifically passed on for a gamepad
export default class GamepadCommand {
    execute(player, data) {}

    onPressed() {}
    onReleased() {}
}

export class GamepadMoveHorizontalCommand {
    execute(player, data) {
        const physics_component = player.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;
        if (player.isAttacking || !player.is_controllable) return;

        physics_component.vel.x += data * 150;
    }
}