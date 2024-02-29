/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    An inherited Component class handling the physics domain, implementing behaviour for entities.

import Component from "./Component.js";
import CanvasManager from "../Singletons/CanvasManager.js";

export default class RenderingComponent extends Component {
    frame_index = 0;
    last_update = Date.now();
    update_speed = 240;


    constructor() {
        super();
        
       }

    update(transform, state_animation, state_frame_data,state_changed)
    {
        this.#updateAnimation(state_frame_data, state_changed);
        this.#render(transform, state_animation, state_frame_data);
    }

    #updateAnimation(state_frame_data, state_changed) {
        if(state_changed) this.frame_index = 0;
        if ((Date.now() - this.last_update) < this.update_speed * state_frame_data["animation_scale"]) return;

        this.frame_index = (this.frame_index + 1) % state_frame_data["num_frames"];
        this.last_update = Date.now();
    }

    

    #render(transform, state_animation, state_frame_data) {
        CanvasManager.getInstance(CanvasManager).gameplayContext.drawImage(
            state_animation,
            this.frame_index * state_frame_data["sheet_width"] / state_frame_data["num_frames"],
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