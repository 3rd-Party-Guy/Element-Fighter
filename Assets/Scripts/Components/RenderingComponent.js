/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    An inherited Component class handling the physics domain, implementing behaviour for entities.

import Component from "./Component.js";
import MovementState from "../StateMachine.js";
import { MovementModes } from "../StateMachine.js";

class AnimationDataContext{
    image = undefined;
    image_source_normal = undefined;
    image_source_flipped = undefined;
    frame_data = undefined;

    constructor(image_source_path, frame_data)
    {
        this.image = new Image();
        this.image_source_normal = image_source_path + ".png";
        this.image_source_flipped = image_source_path + "_flipped.png";
        this.frame_data = frame_data;
    }
};

export default class RenderingComponent extends Component {
    frame_index = 0;
    last_update = Date.now();
    update_speed = 180;

    //MovementState variable
    movementState = new MovementState();

    //Mapping Animation Data to State
    AnimationDataForState = new Map();

    stateAnimation = undefined;
    stateFrameData = undefined;
    
    initComponent(result){

                this.AnimationDataForState.set(MovementModes.Idle,      new AnimationDataContext(result["spritesheets_path"] + "idle",  result["spritesheets_info"]["idle"]));
                this.AnimationDataForState.set(MovementModes.Running,   new AnimationDataContext(result["spritesheets_path"] + "run",   result["spritesheets_info"]["run"]));
                this.AnimationDataForState.set(MovementModes.Jumping,   new AnimationDataContext(result["spritesheets_path"] + "jump",  result["spritesheets_info"]["jump"]));
                this.AnimationDataForState.set(MovementModes.Falling,   new AnimationDataContext(result["spritesheets_path"] + "fall",  result["spritesheets_info"]["fall"]));

    }

    update(physics_component)
    {
        this.#updateMovementState(physics_component);
        this.#updateAnimation()
    }

    #updateAnimation() {
        if(!this.stateFrameData) return;
        if ((Date.now() - this.last_update) < this.update_speed) return;

        this.frame_index = (this.frame_index + 1) % this.stateFrameData["num_frames"];
        this.last_update = Date.now();
    }

    #updateMovementState(physics_component)
    {
        if (!this.AnimationDataForState.get(this.movementState.currentState)) return;
        if (this.movementState.nextState(physics_component.vel.x, physics_component.vel.y, physics_component.is_grounded))
            this.frame_index = 0;
        
        let state_anim_data = this.AnimationDataForState.get(this.movementState.currentState);
        this.stateAnimation = state_anim_data.image;
        this.stateAnimation.src = (physics_component.is_flipped) ? state_anim_data.image_source_flipped : state_anim_data.image_source_normal;
        this.stateFrameData = this.AnimationDataForState.get(this.movementState.currentState).frame_data;
    }

    render(transform,physics_component,ctx) {
        if (!this.stateFrameData) return;

        ctx.beginPath();
        ctx.moveTo(physics_component.groundcast_left.p1.x, physics_component.groundcast_left.p1.y);
        ctx.lineTo(physics_component.groundcast_left.p2.x, physics_component.groundcast_left.p2.y);

        ctx.moveTo(physics_component.groundcast_right.p1.x, physics_component.groundcast_right.p1.y);
        ctx.lineTo(physics_component.groundcast_right.p2.x, physics_component.groundcast_right.p2.y);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 25;
        ctx.stroke();

        ctx.drawImage(
            this.stateAnimation,
            this.frame_index * this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            0,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.stateFrameData["sheet_height"],
            transform.position.x,
            transform.position.y,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.stateFrameData["sheet_height"]
        );
    }
}