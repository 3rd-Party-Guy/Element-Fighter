import System from "./System.js";
import AnimationComponent from "../../Components/AnimationComponent.js";
import EntityManager from "../EntityManager.js";
import PhysicsComponent from "../../Components/PhysicsComponent.js";

export default class AnimationSystem extends System {
    update(delta) {
        for (const e of EntityManager.getInstance(EntityManager).all) {
            const animation_data_component = e.getComponentOfType(AnimationComponent);
            if (!animation_data_component) return;

            const physics_component = e.getComponentOfType(PhysicsComponent);

            const vel_x = physics_component.vel.x;
            const vel_y = physics_component.vel.y;
            const is_grounded = physics_component.is_grounded;
            const attacking_data = e.attackingData;

            animation_data_component.update(vel_x, vel_y, is_grounded, attacking_data);
        }
    }
}