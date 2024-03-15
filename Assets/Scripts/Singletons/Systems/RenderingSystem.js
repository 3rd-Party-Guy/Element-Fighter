// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Renders all entities with the desired information

import System from "./System.js";
import RenderingComponent from "../../Components/RenderingComponent.js";
import EntityManager from "../EntityManager.js";
import TransformComponent from "../../Components/TransformComponent.js";
import AnimationComponent from "../../Components/AnimationComponent.js";

export default class RenderingSystem extends System {
    update(delta) {
        for (const e of EntityManager.getInstance(EntityManager).all) {
            const animation_data = e.getComponentOfType(AnimationComponent);
            
            const transform = e.getComponentOfType(TransformComponent).position;
            const state_animation = animation_data.animation;
            const state_frame_data = animation_data.frame_data;
            const frame_index = animation_data.frame_index;

            e.getComponentOfType(RenderingComponent).update(transform, state_animation, state_frame_data, frame_index);
        }
    }
}