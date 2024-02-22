// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import { clamp, lerp } from "./Math.js";
import Vector2 from "./Vector2.js";
import Line from "./Line.js";
import CollisionBox from "./CollisionBox.js";
import MapColliderManager from "./MapColliderManager.js";
import InputManager from "./InputManager.js";
import MovementState from "./StateMachine.js";
import { MovementModes } from "./StateMachine.js";

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

    x = 0;
    y = 0;

    xVel = 0;
    yVel = 0;

    maxXVel = 100;

    //Character Data
    character_data = undefined;

    frame_index = 0;
    last_update = Date.now();
    update_speed = 180;

    is_flipped = false;
    is_grounded = false;

    jumps_left = 0;

    //MovementState variable
    movementState = new MovementState();

    //Mapping Animation Data to State
    AnimationDataForState = new Map();

    stateAnimation = undefined;
    stateFrameData = undefined;
    x_speed = 1;

    groundcast_left = new Line(new Vector2(0, 0), new Vector2(0, 0));
    groundcast_right = new Line(new Vector2(0, 0), new Vector2(0, 0));

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.x = startX;
        this.y = startY;

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

                // get information about character
                this.character_data = result["character_info"] || {};
                this.maxXVel = this.character_data["max_x_velocity"] || 100;
            })
            .catch(err => console.error("Error getting frame data:\n", err));
    }
    
    get #width() {
        return this.character_data["width"];
    }
    
    get #height() {
        return this.character_data["height"];
    }

    get #center() {
        return new Vector2(
            this.x + this.character_data["width"] / 2,
            this.y + this.character_data["height"] / 2
        );
    }

    #updateAnimation() {
        if(!this.stateFrameData) return;
        if ((Date.now() - this.last_update) < this.update_speed) return;

        this.frame_index = (this.frame_index + 1) % this.stateFrameData["num_frames"];
        this.last_update = Date.now();
    }

    #updatePosition(deltaTime) {
        if (!this.character_data) return;

        this.x += this.xVel * deltaTime;
        this.y += this.yVel * deltaTime;
        
        if (this.xVel < 0) this.is_flipped = true;
        else if (this.xVel > 0) this.is_flipped = false;

        this.xVel = lerp(this.xVel, 0, this.character_data["x_friction"]);
    }

    #updateVelocities(fixedDeltaTime) {
        if (!this.character_data) return;
        
        if (!this.is_grounded)
            this.yVel += this.character_data["gravity"] * fixedDeltaTime; 
        else
            this.yVel = Math.min(0, this.yVel);

        if (this.yVel > 0)
            this.yVel += this.character_data["fall_multiplier"] * fixedDeltaTime;
        if (this.yVel < 0 && !InputManager.getInstance(InputManager).isKeyActive("KeyW"))
            this.yVel += this.character_data["low_jump_multiplier"] * fixedDeltaTime;

        this.xVel = clamp(this.xVel, -this.maxXVel, this.maxXVel);

        if(Math.abs(this.xVel) < 10 && this.xVel != 0)
                this.xVel = 0;
    }
    
    #updateMovementState()
    {
        if (!this.AnimationDataForState.get(this.movementState.currentState)) return;
        if (this.movementState.nextState(this.xVel, this.yVel, this.is_grounded))
            this.frame_index = 0;
        
        let state_anim_data = this.AnimationDataForState.get(this.movementState.currentState);
        this.stateAnimation = state_anim_data.image;
        this.stateAnimation.src = (this.is_flipped) ? state_anim_data.image_source_flipped : state_anim_data.image_source_normal;
        this.stateFrameData = this.AnimationDataForState.get(this.movementState.currentState).frame_data;
    }

    #checkGrounded(fixed_delta_time) {
        if (this.yVel < 0) {
            this.is_grounded = false;
            return;
        }
        if (!this.stateFrameData) return;

        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();
        
        // INFO: remove magic numbers
        const groundcast_left_x = this.#center.x - this.#width / 2 + this.xVel * fixed_delta_time + 10;
        const groundcast_right_x = this.#center.x + this.#width / 2 + this.xVel * fixed_delta_time + 30;

        const player_bottom_y = this.y  + this.#height + this.yVel * fixed_delta_time;
        
        this.groundcast_left = new Line(
            new Vector2(groundcast_left_x, player_bottom_y),
            new Vector2(groundcast_left_x, Math.max(player_bottom_y + 10, player_bottom_y + this.yVel * fixed_delta_time * 25))
        );

        this.groundcast_right = new Line(
            new Vector2(groundcast_right_x, player_bottom_y),
            new Vector2(groundcast_right_x, Math.max(player_bottom_y + 10, player_bottom_y + this.yVel * fixed_delta_time * 25))
        );

        for (const col_box of col_boxes) {
            if (col_box.ld.y < this.y + this.#height - 10) continue;
            if (col_box.collidesWithGroundcast(this.groundcast_left) || col_box.collidesWithGroundcast(this.groundcast_right)) {
                const ground_y = col_box.ru.y - this.#height; 
                if (this.y + this.yVel * fixed_delta_time > ground_y - this.#height / 2 || this.yVel <= 0) {
                    this.y = ground_y;
                    this.yVel = Math.min(this.yVel, 0);
                    this.jumps_left = this.character_data["jumps"];
                    this.is_grounded = true;
                    return;
                }
            }
        }

        // character should have one more jump when jumping from ground
        this.jumps_left = this.character_data["jumps"] - 1;
        this.is_grounded = false;
    }

    jump() {
        if (this.is_grounded || this.jumps_left > 0) {
            this.yVel = this.character_data["jump_force"] * -1;
            this.jumps_left--;
            this.is_grounded = false;
        }
    }

    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update(deltaTime) {
        this.#updatePosition(deltaTime);
        this.#updateMovementState();
        this.#updateAnimation();
    }
    
    fixedUpdate(fixedDeltaTime){
        this.#checkGrounded(fixedDeltaTime);
        this.#updateVelocities(fixedDeltaTime);
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        if (!this.stateFrameData) return;

        ctx.beginPath();
        ctx.moveTo(this.groundcast_left.p1.x, this.groundcast_left.p1.y);
        ctx.lineTo(this.groundcast_left.p2.x, this.groundcast_left.p2.y);

        ctx.moveTo(this.groundcast_right.p1.x, this.groundcast_right.p1.y);
        ctx.lineTo(this.groundcast_right.p2.x, this.groundcast_right.p2.y);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 25;
        ctx.stroke();

        ctx.drawImage(
            this.stateAnimation,
            this.frame_index * this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            0,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.stateFrameData["sheet_height"],
            this.x,
            this.y,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.stateFrameData["sheet_height"]
        );
    }
};