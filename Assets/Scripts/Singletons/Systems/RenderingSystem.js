// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Renders all entities with the desired information

import Singleton from "../../Singleton.js";
import RenderingComponent from "../../Components/RenderingComponent.js";
import EntityManager from "../EntityManager.js";
import Entity from "../../Entity.js";
import PhysicsComponent from "../../Components/PhysicsComponent.js";
import TransformComponent from "../../Components/TransformComponent.js";

export default class RenderingSystem extends Singleton {
    update(delta) {
        for (const e of EntityManager.getInstance(EntityManager).entities) {
            const physics_component = e.getComponentOfType(PhysicsComponent);
            const transfrom_component = e.getComponentOfType(TransformComponent);

            const transform = transfrom_component.transform;

            const vel_x = physics_component.vel.x;
            const vel_y = physics_component.vel.y;

            const is_grounded = physics_component.is_grounded;

            e.getComponentOfType(RenderingComponent).update(transform, vel_x, vel_y, is_grounded);
        }
    }
}