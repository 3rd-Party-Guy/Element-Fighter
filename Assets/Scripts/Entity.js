// Author:          Nikolay Hadzhiev
// Description:     Base Entity class

import { clamp, lerp } from "./Math.js";
import Vector2 from "./Vector2.js";
import CollisionBox from "./CollisionBox.js";
import MapColliderManager from "./MapColliderManager.js";
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

    maxXVel = 250;
    maxYVel = 250;

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
                const result = data.find(e => e.name === this.entity_name)
                this.AnimationDataForState.set(MovementModes.Idle, new AnimationDataContext(result["spritesheets_path"] + "idle.png",result["spritesheets_info"]["idle"] || {} ));
                this.AnimationDataForState.set(MovementModes.Running,new AnimationDataContext(result["spritesheets_path"] + "run.png", result["spritesheets_info"]["run"] || {}));
                this.character_data = result["character_info"] || {};
            })
            .catch(err => 
                console.error("Error getting frame data:\n", err));
            
    }

    #updateAnimation() {
        

        if ((Date.now() - this.last_update) < this.update_speed)
            return;


          
        this.frame_index = (this.frame_index + 1) % this.stateFrameData["num_frames"];
        this.last_update = Date.now();


    }

    #updateCollisionBox() {
        if (!this.stateFrameData) return;

      
        this.collision_box.ld.x = this.x;
        this.collision_box.ld.y = this.y;

      
        this.collision_box.ru.x = this.x + this.stateFrameData["sheet_width"] / this.stateFrameData["num_frames"];
        this.collision_box.ru.y = this.y + this.stateFrameData["sheet_height"];
       
    


        

       
    }

    #updatePosition(deltaTime) {
        if (!this.character_data) return;
        
        // INFO: note 1 (applied deltaTime twice)
        if (!this.is_grounded)
            this.yVel += this.character_data["gravity"]; 
        else
            this.yVel = Math.min(0, this.yVel);

        this.xVel = clamp(this.xVel, -this.maxXVel, this.maxXVel);

        this.x += this.xVel * deltaTime;
        this.y += this.yVel * deltaTime;

        this.xVel = lerp(this.xVel, 0, this.character_data["x_friction"]);
        

        
        if (this.xVel < 0)
            this.is_flipped = true;
        else if (this.xVel > 0)
            this.is_flipped = false;

        if(Math.abs(this.xVel) < 10 && this.xVel != 0)
        {
                this.xVel = 0;
        }
    }
    
    #updateMovementState()
    {
        console.log(this.movementState.currentState);
        console.log(this.is_grounded);
        if(!this.AnimationDataForState.get(this.movementState.currentState)) return;
        if(!this.stateFrameData) this.#updateAnimationState();
        this.movementState.nextState(this.xVel, this.is_grounded);
        console.log(this.movementState.currentState);
        console.log(this.is_grounded);
        this.#updateAnimationState();
    }

    #updateAnimationState()
    {
        if (!this.AnimationDataForState.get(this.movementState.currentState)) return;
        this.stateAnimation = this.AnimationDataForState.get(this.movementState.currentState).aImage;
        this.stateFrameData = this.AnimationDataForState.get(this.movementState.currentState).aFrame_data;
    }


    #setGrounded() {
        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();

        for (const col_box of col_boxes) {
            if (this.collision_box.collidesWith(col_box)) {
                this.is_grounded = true;
                this.jumps_left = this.character_data["jumps"];
                return;
            }
        }

        this.is_grounded = false;
    }


    jump() {
        if (this.jumps_left > 0) {
            this.yVel -= this.character_data["jump_force"];
            this.jumps_left--;
            this.movementState.nextState(MovementModes.Jumping);
        }
    }

    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update() {
        this.#updateMovementState();
        this.#updateAnimation();
        
    }
    

    

    // INFO: Note 2
    fixedUpdate(deltaTime){
        this.#updatePosition(deltaTime);
        this.#updateCollisionBox();
        this.#setGrounded();
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        if (!this.stateFrameData) return;
        if (!this.collision_box) return;

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