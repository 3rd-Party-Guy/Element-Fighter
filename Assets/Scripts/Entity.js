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
    aImage = undefined;
    aFrame_data = undefined;

    constructor(imageSource, frame_data)
    {
        this.aImage = new Image();
        this.aImage.src = imageSource;
        this.aFrame_data = frame_data;
    }
};

export default class Entity {
    entity_name = "Knight";

    x = 0;
    y = 0;

    collision_box = new CollisionBox(new Vector2(0, 0), new Vector2(0, 0));

    xVel = 0;
    yVel = 0;

    maxXVel = 100;

    //Character Data
    character_data = undefined;

    frame_index = 0;
    last_update = Date.now();
    update_speed = 60;

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

    ground_raycast = new Line(new Vector2(0, 0), new Vector2(0, 0));

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
                this.AnimationDataForState.set(MovementModes.Idle,      new AnimationDataContext(result["spritesheets_path"] + "idle.png",  result["spritesheets_info"]["idle"] || {}));
                this.AnimationDataForState.set(MovementModes.Running,   new AnimationDataContext(result["spritesheets_path"] + "idle.png",   result["spritesheets_info"]["run"]  || {}));
                this.AnimationDataForState.set(MovementModes.Jumping,   new AnimationDataContext(result["spritesheets_path"] + "idle.png",  result["spritesheets_info"]["jump"] || {}));
                
                // get information about character
                this.character_data = result["character_info"] || {};
                this.maxXVel = this.character_data["max_x_velocity"] || 100;
            })
            .catch(err => console.error("Error getting frame data:\n", err));
    }

    get #center() {
        return new Vector2(
            this.x + this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"] / 1.5,
            this.y + this.character_data["height"] / 2
        );
    }

    #updateAnimation() {
        if(!this.stateFrameData) return;
        if ((Date.now() - this.last_update) < this.update_speed) return;

        this.frame_index = (this.frame_index + 1) % this.stateFrameData["num_frames"];
        this.last_update = Date.now();
    }

    #updateCollisionBox() {
        if (!this.stateFrameData) return;

        this.collision_box.ld.x = this.x;
        this.collision_box.ld.y = this.y;
        
        this.collision_box.ru.x = this.x + this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"];
        this.collision_box.ru.y = this.y + this.character_data["height"];
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
        if(!this.AnimationDataForState.get(this.movementState.currentState)) return;
        if(this.movementState.nextState(this.xVel, this.is_grounded))
            this.frame_index = 0;
        
        this.stateAnimation = this.AnimationDataForState.get(this.movementState.currentState).aImage;
        this.stateFrameData = this.AnimationDataForState.get(this.movementState.currentState).aFrame_data;
    }

    #setGrounded(fixed_delta_time) {
        if (!this.stateFrameData) return;
        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();
        
        this.ground_raycast.ru.x = this.#center.x;
        this.ground_raycast.ru.y = this.y + this.character_data["height"];

        this.ground_raycast.ld.x = this.#center.x;
        this.ground_raycast.ld.y = this.y + this.character_data["height"] + this.yVel * fixed_delta_time * 25;

        for (const col_box of col_boxes) {
            if (col_box.collidesWithLine(this.ground_raycast)) {
                const ground_y = col_box.ru.y - this.character_data["height"]; 
                if (this.y + this.yVel > ground_y || Math.abs(ground_y - this.y) < this.character_data["height"]) {
                    this.y = ground_y;
                    this.yVel = Math.min(this.yVel, 0);
                    this.is_grounded = true;
                    this.jumps_left = this.character_data["extra_jumps"];
                    return;
                }
            }
        }
        this.is_grounded = false;
    }

    jump() {
        if (this.is_grounded || this.jumps_left > 0) {
            this.yVel = this.character_data["jump_force"] * -1;
            this.jumps_left--;
            this.movementState.nextState(MovementModes.Jumping);
        }
    }

    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update(deltaTime) {
        this.#updatePosition(deltaTime);
        this.#updateMovementState();
        // this.#updateAnimation();
    }
    
    fixedUpdate(fixedDeltaTime){
        this.#setGrounded(fixedDeltaTime);
        this.#updateCollisionBox();
        this.#updateVelocities(fixedDeltaTime);
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        if (!this.stateFrameData) return;
        if (!this.collision_box) return;

        // ctx.beginPath();
        // ctx.moveTo(this.ground_raycast.ld.x, this.ground_raycast.ld.y);
        // ctx.lineTo(this.ground_raycast.ru.x, this.ground_raycast.ru.y);
        // ctx.stroke();

        ctx.drawImage(
            this.stateAnimation,
            this.frame_index * this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            0,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.character_data["height"],
            this.x,
            this.y,
            this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"],
            this.character_data["height"]
        );
    }
};