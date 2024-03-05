import AnimationComponent from "./Components/AnimationComponent.js";
import { AttackModes } from "./StateMachine.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";

export default class GamepadCommand {
    execute(player, data) {}
}

export class GamepadMoveHorizontalCommand {
    execute(player, data) {
        const physics_component = player.getComponentOfType(PhysicsComponent);
        if (!physics_component) return;
        if (player.getComponentOfType(AnimationComponent).attack_state.current_state != AttackModes.None) return;

        physics_component.vel.x += data * 150;
    }
}

export class GamepadJumpCommand {
    execute(player, data) {
        player.getComponentOfType(PhysicsComponent)?.jump();
    }
}

export class GamepadDuckCommand {
    execute(player, data) {
        player.getComponentOfType(PhysicsComponent)?.duck();
    }
}