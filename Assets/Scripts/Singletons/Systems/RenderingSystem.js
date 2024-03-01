// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Renders all entities with the desired information

import System from "./System.js";
import RenderingComponent from "../../Components/RenderingComponent.js";
import EntityManager from "../EntityManager.js";
import PhysicsComponent from "../../Components/PhysicsComponent.js";
import TransformComponent from "../../Components/TransformComponent.js";
import AnimationDataComponent from "../../Components/AnimationDataComponent.js";

export default class RenderingSystem extends System {
    update(delta) {
        for (const e of EntityManager.getInstance(EntityManager).entities) {
            const animation_data_component = e.getComponentOfType(AnimationDataComponent);
            const transfrom_component = e.getComponentOfType(TransformComponent);

            const transform = transfrom_component.transform;

            const state_animation = animation_data_component.animation;
            const state_frame_data = animation_data_component.frame_data;
            const state_changed =  animation_data_component.state_changed;

            e.getComponentOfType(RenderingComponent).update(transform, state_animation, state_frame_data, state_changed);
        }
    }
}