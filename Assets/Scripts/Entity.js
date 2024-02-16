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

    center_offset = 0;

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

    ground_col_box = new CollisionBox(new Vector2(0, 0), new Vector2(0, 0));

    #setSpritesheetData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                const result = data.find(e => e.name === this.entity_name)
                this.image.src = result["spritesheets_path"] + "idle.png";
                this.frame_data = result["spritesheets_info"]["idle"] || {};
                this.character_data = result["character_info"] || {};

                const char_width = this.frame_data["sheet_width"] / this.frame_data["num_frames"]
                const char_height = this.frame_data["sheet_height"] / 2 

                this.center_offset = new Vector2(
                    char_width / 2,
                    char_height / 2                    
                );

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

    #updateAnimation() {
        if (!this.frame_data) return;

        if ((Date.now() - this.last_update) < this.update_speed)
            return;

        this.frame_index = (this.frame_index + 1) % this.frame_data["num_frames"];
        this.last_update = Date.now();
    }

    #updatePosition() {
        if (!this.character_data) return;
        
        if (!this.is_grounded)
            this.yVel += this.character_data["gravity"]; 
        else
            this.yVel = 0;

        this.xVel = clamp(this.xVel, -this.maxXVel, this.maxXVel);

        this.x += this.xVel;
        this.y += this.yVel;

        this.xVel = lerp(this.xVel, 0, this.character_data["x_friction"]);
        
        if (this.xVel < 0)
            this.is_flipped = true;
        else if (this.xVel > 0)
            this.is_flipped = false;

        this.ground_col_box.setLD(this.x, this.y + this.center_offset.getY() * 2 + 10);
        this.ground_col_box.setRU(this.x + this.center_offset.getX() * 2, this.y + this.center_offset.getY() * 2 + 15);
    }

    #setGrounded() {
        if (!this.ground_col_box) return;

        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();

        for (let col_box of col_boxes) {
            if (col_box.collidesWith(this.ground_col_box)) {
                this.is_grounded = true;
                col_box.is_active = true;
            } else
                col_box.is_active = false;
        }
    }

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.x = startX;
        this.y = startY;

        this.image = new Image();

        this.#setSpritesheetData();
    }

    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update() {
        this.#setGrounded();
        this.#updateAnimation();
        this.#updatePosition();
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
        ctx.rect(this.collision_box.getLD().getX(), this.ground_col_box.getLD().getY(), this.collision_box.getWidth(), this.collision_box.getHeight());
        ctx.fill();

        ctx.fillStyle = "green";
        ctx.rect(this.ground_col_box.getLD().getX(), this.ground_col_box.getLD().getY(), this.ground_col_box.getWidth(), this.ground_col_box.getHeight());
        ctx.fill();
    }
};