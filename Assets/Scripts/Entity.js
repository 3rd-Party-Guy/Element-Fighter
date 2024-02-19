// Author:          Nikolay Hadzhiev
// Description:     Base Entity class

import { clamp, lerp } from "./Math.js";
import Vector2 from "./Vector2.js";
import CollisionBox from "./CollisionBox.js";
import MapColliderManager from "./MapColliderManager.js";

export default class Entity {
    entity_name = "Knight";

    x = 0;
    y = 0;

    collision_box = undefined;

    xVel = 0;
    yVel = 0;

    maxXVel = 250;
    maxYVel = 250;

    image = undefined;

    frame_data = undefined;
    character_data = undefined;

    frame_index = 0;
    last_update = Date.now();
    update_speed = 60;

    is_flipped = false;
    is_grounded = false;

    ground_col_box = undefined;

    jumps_left = 0;

    #setSpritesheetData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                const result = data.find(e => e.name === this.entity_name)
                this.image.src = result["spritesheets_path"] + "idle.png";
                this.frame_data = result["spritesheets_info"]["idle"] || {};
                this.character_data = result["character_info"] || {};

                this.collision_box = new CollisionBox(
                    new Vector2(this.frame_data["hitbox"]["left_down"]["x"],
                                this.frame_data["hitbox"]["left_down"]["y"]),
                    new Vector2(this.frame_data["hitbox"]["right_up"]["x"],
                                this.frame_data["hitbox"]["right_up"]["y"])
                );
            })
            .catch(err => 
                console.error("Error getting frame data:\n", err));
    }

    // INFO: MIGHT NEED TO CHANGE MAGIC NUMBERS HERE
    get center_offset() {
        return new Vector2(
            this.frame_data["sheet_width"] / this.frame_data["num_frames"] / 4,
            this.frame_data["sheet_height"] / 2 - 15
        )
    }

    #updateAnimation() {
        if (!this.frame_data) return;

        if ((Date.now() - this.last_update) < this.update_speed)
            return;

        this.frame_index = (this.frame_index + 1) % this.frame_data["num_frames"];
        this.last_update = Date.now();
    }

    #updatePosition(deltaTime) {
        if (!this.character_data) return;
        
        if (!this.is_grounded)
            this.yVel += this.character_data["gravity"] *deltaTime; 
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

        // INFO: MIGHT NEED TO CHANGE MAGIC NUMBERS HERE
        this.ground_col_box.ld = (new Vector2( this.x + 15, this.y + this.center_offset.y * 2 + 10));
        this.ground_col_box.ru = (new Vector2((this.x + this.center_offset.x * 2) + 15, this.y + this.center_offset.y * 2 + 15));
    }

    #setGrounded() {
        if (!this.ground_col_box) return;

        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();

        for (const col_box of col_boxes) {
            if (col_box.collidesWith(this.ground_col_box)) {
                this.is_grounded = true;
                this.jumps_left = this.character_data["jumps"];
                return;
            }
        }
        this.is_grounded = false;
        console.log(this.is_grounded);
    }

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.x = startX;
        this.y = startY;

        this.image = new Image();

        this.#setSpritesheetData();
        this.ground_col_box = new CollisionBox( new Vector2(0, 0), new Vector2(0, 0) );
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

    fixedUpdate(deltaTime){
        this.#updatePosition(deltaTime);
        this.#setGrounded();
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        if (!this.frame_data) return;
        if (!this.ground_col_box) return;

        ctx.drawImage(
            this.image,
            this.frame_index * this.frame_data["sheet_width"] / this.frame_data["num_frames"],
            0,
            this.frame_data["sheet_width"] / this.frame_data["num_frames"],
            this.frame_data["sheet_height"],
            this.x,
            this.y,
            this.frame_data["sheet_width"] / this.frame_data["num_frames"],
            this.frame_data["sheet_height"]
        );

        ctx.fillStyle = "green";
        ctx.rect(this.ground_col_box.ld.getX, this.ground_col_box.ld.getY, this.ground_col_box.width, this.ground_col_box.height);
        ctx.fill();
    }
};