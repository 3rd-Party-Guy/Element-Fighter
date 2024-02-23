// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import MovementState from "./StateMachine.js";
import { MovementModes } from "./StateMachine.js";
import { TransformComponent } from "./Component.js";
import { PhysicsComponent } from "./Component.js";
import Transform from "./Transform.js";



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

export default class Entity {
    entity_name = "Knight";

    frame_index = 0;
    last_update = Date.now();
    update_speed = 180;


    //MovementState variable
    movementState = new MovementState();

    //Mapping Animation Data to State
    AnimationDataForState = new Map();

    stateAnimation = undefined;
    stateFrameData = undefined;

    transform_component = new TransformComponent();
    physics_component = new PhysicsComponent();
   

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.transform_component.initComponent(new Transform(new Vector2(startX, startY)));
        this.#setSpritesheetData();
    }

    #setSpritesheetData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                // find the right json data for this entity based on the name
                const result = data.find(e => e.name === this.entity_name)

                // set up all animation states
                this.AnimationDataForState.set(MovementModes.Idle,      new AnimationDataContext(result["spritesheets_path"] + "idle",  result["spritesheets_info"]["idle"]));
                this.AnimationDataForState.set(MovementModes.Running,   new AnimationDataContext(result["spritesheets_path"] + "run",   result["spritesheets_info"]["run"]));
                this.AnimationDataForState.set(MovementModes.Jumping,   new AnimationDataContext(result["spritesheets_path"] + "jump",  result["spritesheets_info"]["jump"]));
                this.AnimationDataForState.set(MovementModes.Falling,   new AnimationDataContext(result["spritesheets_path"] + "fall",  result["spritesheets_info"]["fall"]));

                // Initialize Physics Component with entity data
                this.physics_component.initComponent(result["character_info"] || {});
            })
            .catch(err => console.error("Error getting frame data:\n", err));
    }
    
   

    #updateAnimation() {
        if(!this.stateFrameData) return;
        if ((Date.now() - this.last_update) < this.update_speed) return;

        this.frame_index = (this.frame_index + 1) % this.stateFrameData["num_frames"];
        this.last_update = Date.now();
    }


    #updateMovementState()
    {
        if (!this.AnimationDataForState.get(this.movementState.currentState)) return;
        if (this.movementState.nextState(this.physics_component.vel.x, this.physics_component.vel.y, this.physics_component.is_grounded))
            this.frame_index = 0;
        
        let state_anim_data = this.AnimationDataForState.get(this.movementState.currentState);
        this.stateAnimation = state_anim_data.image;
        this.stateAnimation.src = (this.physics_component.is_flipped) ? state_anim_data.image_source_flipped : state_anim_data.image_source_normal;
        this.stateFrameData = this.AnimationDataForState.get(this.movementState.currentState).frame_data;
    }


    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update(deltaTime) {
        this.physics_component.update(this.transform_component.transform, deltaTime);
        this.#updateMovementState();
        this.#updateAnimation();
    }
    
    fixedUpdate(fixedDeltaTime){
       console.log(this.transform_component.transform.position);
        this.physics_component.fixedUpdate(this.transform_component.transform, fixedDeltaTime);
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        if (!this.stateFrameData) return;

        ctx.beginPath();
        ctx.moveTo(this.physics_component.groundcast_left.p1.x, this.physics_component.groundcast_left.p1.y);
        ctx.lineTo(this.physics_component.groundcast_left.p2.x, this.physics_component.groundcast_left.p2.y);

        ctx.moveTo(this.physics_component.groundcast_right.p1.x, this.physics_component.groundcast_right.p1.y);
        ctx.lineTo(this.physics_component.groundcast_right.p2.x, this.physics_component.groundcast_right.p2.y);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 25;
        ctx.stroke();

        ctx.drawImage(
            this.stateAnimation,
            this.frame_index * this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            0,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.stateFrameData["sheet_height"],
            this.transform_component.transform.position.x,
            this.transform_component.transform.position.y,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.stateFrameData["sheet_height"]
        );
    }
};