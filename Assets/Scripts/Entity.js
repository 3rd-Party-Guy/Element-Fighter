// Author:          Nikolay Hadzhiev
// Description:     Base Entity class

import { clamp, lerp } from "./Math.js";
import Vector2 from "./Vector2.js";
import CollisionBox from "./CollisionBox.js";
import MapColliderManager from "./MapColliderManager.js";
import MovementState from "./StateMachine.js";
import { MovementModes } from "./StateMachine.js";

export default class Entity {
    entity_name = "Knight";

    x = 0;
    y = 0;

    collision_box = new CollisionBox(new Vector2(0, 0), new Vector2(0, 0));

    xVel = 0;
    yVel = 0;

    maxXVel = 250;
    maxYVel = 250;

    //Idle Animation
    idleImage = undefined;
    idleFrame_data = undefined;

    //Running Animation
    runningImage = undefined;
    runningFrame_data = undefined;

    //Character Data
    character_data = undefined;

    frame_index = 0;
    last_update = Date.now();
    update_speed = 60;

    is_flipped = false;
    is_grounded = false;

    jumps_left = 0;

    movementState = new MovementState();


    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.x = startX;
        this.y = startY;

        this.idleImage = new Image();
        this.runningImage = new Image();
        this.#setSpritesheetData();
    }

    #setSpritesheetData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                const result = data.find(e => e.name === this.entity_name)
                this.idleImage.src = result["spritesheets_path"] + "idle.png";
                this.idleFrame_data = result["spritesheets_info"]["idle"] || {};
                this.runningImage.src = result["spritesheets_path"] + "run.png";
                this.runningFrame_data = result["spritesheets_info"]["run"] || {};
                this.character_data = result["character_info"] || {};
            })
            .catch(err => 
                console.error("Error getting frame data:\n", err));
    }

    #updateAnimation() {
        if (!this.idleFrame_data) return;
        if (!this.runningFrame_data) return;
        console.log(this.movementState);
        if(this.xVel != 0 && this.is_grounded)
        {
            
            this.movementState.nextState(MovementModes.Running);
        
        }
        else if (this.xVel == 0 && this.is_grounded)
        {
           
            this.movementState.nextState(MovementModes.Idle);
        }

        if ((Date.now() - this.last_update) < this.update_speed)
            return;


            switch(this.movementState.currentState){
                case MovementModes.Idle:
                    this.frame_index = (this.frame_index + 1) % this.idleFrame_data["num_frames"];
                break;
                case MovementModes.Running:
                    this.frame_index = (this.frame_index + 1) % this.runningFrame_data["num_frames"];
                    break;
                }
        this.last_update = Date.now();


    }

    #updateCollisionBox() {
        if (!this.idleFrame_data) return;
        if (!this.runningFrame_data) return;

        this.collision_box.ld.x = this.x;
        this.collision_box.ld.y = this.y;

        switch(this.movementState.currentState){
            case MovementModes.Idle:
                this.collision_box.ru.x = this.x + this.idleFrame_data["sheet_width"] / this.idleFrame_data["num_frames"];
                this.collision_box.ru.y = this.y + this.idleFrame_data["sheet_height"];
                break;
            case MovementModes.Running:
                this.collision_box.ru.x = this.x + this.runningFrame_data["sheet_width"] / this.runningFrame_data["num_frames"];
                this.collision_box.ru.y = this.y + this.runningFrame_data["sheet_height"];
        }
    


        

       
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
        }
    }

    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update() {
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
        if (!this.idleFrame_data) return;
        if (!this.runningFrame_data) return;
        if (!this.collision_box) return;


        switch(this.movementState.currentState)
        {
            case MovementModes.Idle:
                ctx.drawImage(
                    this.idleImage,
                    this.frame_index * this.idleFrame_data["sheet_width"] / this.idleFrame_data["num_frames"],
                    0,
                    this.idleFrame_data["sheet_width"] / this.idleFrame_data["num_frames"],
                    this.idleFrame_data["sheet_height"],
                    this.x,
                    this.y,
                    this.idleFrame_data["sheet_width"] / this.idleFrame_data["num_frames"],
                    this.idleFrame_data["sheet_height"]
                );
                break;
            case MovementModes.Running:
                ctx.drawImage(
                    this.runningImage,
                    this.frame_index * this.runningFrame_data["sheet_width"] / this.runningFrame_data["num_frames"],
                    0,
                    this.runningFrame_data["sheet_width"] / this.runningFrame_data["num_frames"],
                    this.runningFrame_data["sheet_height"],
                    this.x,
                    this.y,
                    this.runningFrame_data["sheet_width"] / this.runningFrame_data["num_frames"],
                    this.runningFrame_data["sheet_height"]
                );
                break;
        }

    }
};