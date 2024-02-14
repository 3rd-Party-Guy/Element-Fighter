// Author:          Nikolay Hadzhiev
// Description:     Base Entity class

import { clamp, lerp } from "./Math.js";

export default class Entity {
    entity_name = "Knight";

    x = 0;
    y = 0;

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

    isFlipped = false;

    #setSpritesheetData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                const result = data.find(e => e.name === this.entity_name)
                this.image.src = result["spritesheets_path"] + "idle.png";
                this.frame_data = result["spritesheets_info"]["idle"] || {};
                this.character_data = result["character_info"] || {};
            })
            .catch(err => 
                console.error("Error getting frame data:\n", err));
    }

    #update_animation() {
        if (!this.frame_data) return;

        if ((Date.now() - this.last_update) < this.update_speed)
            return;

        this.frame_index = (this.frame_index + 1) % this.frame_data["num_frames"];
        this.last_update = Date.now();
    }

    #update_position() {
        if (!this.character_data) return;

        this.xVel = clamp(this.xVel, -this.maxXVel, this.maxXVel);

        this.x += this.xVel;
        this.y += this.yVel;

        this.xVel = lerp(this.xVel, 0, this.character_data["x_friction"]);
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
        this.#update_animation();
        this.#update_position();
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        if (!this.frame_data) return;

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
    }
};