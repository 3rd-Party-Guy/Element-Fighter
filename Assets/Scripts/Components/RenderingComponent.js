/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    An inherited Component class handling the physics domain, implementing behaviour for entities.

import Component from "./Component.js";
import CanvasManager from "../Singletons/CanvasManager.js";

export default class RenderingComponent extends Component {
    render_collision = false;
    
    constructor() {
        super();
    }

    update(position, state_animation, state_frame_data, frame_index)
    {
        this.#render(position, state_animation, state_frame_data, frame_index);
        
        if (this.render_collision)
            this.#renderCollision(position, state_animation, state_frame_data, frame_index);
    }
    
    #render(position, state_animation, state_frame_data, frame_index) {
        CanvasManager.getInstance(CanvasManager).gameplayContext.drawImage(
            state_animation,
            frame_index * state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            0,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"],
            position.x,
            position.y,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"]
        );
    }

    #renderCollision(position, state_animation, state_frame_data, frame_index) {
        CanvasManager.getInstance(CanvasManager).collisionContext.drawImage(
            state_animation,
            frame_index * state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            0,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"],
            position.x,
            position.y,
            state_frame_data["sheet_width"] / state_frame_data["num_frames"],
            state_frame_data["sheet_height"] 
        );
    }
}