/// Author:         Leon Enders, Nikolay Hadzhiev
/// Description:    Updates all physics components of all entities with their required information.
///                 This way the data from the transform component is still divided from that of the physics component.

import System from "./System.js";
import PhysicsComponent from "../../Components/PhysicsComponent.js";
import TransformComponent from "../../Components/TransformComponent.js";
import EntityManager from "../EntityManager.js";
import InputManager from "../InputManager.js";

export default class PhysicsSystem extends System {
        update(delta_Time)
        {   
            for (const e of EntityManager.getInstance(EntityManager).entities) {
                const transfrom_component = e.getComponentOfType(TransformComponent);

                e.getComponentOfType(PhysicsComponent)?.update(transfrom_component.transform, delta_Time);
            }
        }

        fixedUpdate(fixed_delta_time)
        {
            for (const e of EntityManager.getInstance(EntityManager).entities) {
                const transfrom_component = e.getComponentOfType(TransformComponent);
                const physics_component = e.getComponentOfType(PhysicsComponent);
                
                if (!physics_component) return;

                physics_component.should_apply_low_jump_multiplier = !InputManager.getInstance(InputManager).isPlayerHoldingJump(e);
                e.getComponentOfType(PhysicsComponent)?.fixedUpdate(transfrom_component.transform, fixed_delta_time);
            }
        }
}