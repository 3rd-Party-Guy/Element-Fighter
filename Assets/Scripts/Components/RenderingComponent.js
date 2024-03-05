/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    An inherited Component class handling the physics domain, implementing behaviour for entities.

import Component from "./Component.js";
import CanvasManager from "../Singletons/CanvasManager.js";

export default class RenderingComponent extends Component {
    constructor() {
        super();
    }

    update(transform, state_animation, state_frame_data, frame_index)
    {
        this.#render(transform, state_animation, state_frame_data, frame_index);
        this.#renderCollision(transform, state_animation, state_frame_data, frame_index);
    }

    #render(transform, state_animation, state_frame_data, frame_index) {
        CanvasManager.getInstance(CanvasManager).gameplayContext.drawImage(
            state_animation,
            frame_index * state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            0,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"],
            transform.position.x,
            transform.position.y,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"]
        );
    }

    #renderCollision(transform, state_animation, state_frame_data, frame_index) {
        CanvasManager.getInstance(CanvasManager).collisionContext.drawImage(
            state_animation,
            frame_index * state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            0,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"],
            transform.position.x,
            transform.position.y,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"] 
        );
    }
}