/// Author:         Leon Enders, Nikolay Hadzhiev
/// Description:    An inherited Component class handling the physics domain, implementing behaviour for entities.

import { clamp, lerp } from "../Math.js";
import Vector2 from "../Vector2.js";
import Line from "../Line.js";
import Component from "./Component.js";
import MapColliderManager from "../Singletons/MapColliderManager.js";
import InputManager from "../Singletons/InputManager.js";

export default class PhysicsComponent extends Component {
    // Property to hold all relevant physics data for an entity
    physics_data = undefined;

    // Properties for calculating physics
    vel = new Vector2(0,0);
    maxVel = new Vector2(100,0);
    x_speed = 1;
    
    //Properties for states
    is_flipped = false;
    jumps_left = 0;

    //Properties for collision
    groundcast_left = new Line(new Vector2(0, 0), new Vector2(0, 0));
    groundcast_right = new Line(new Vector2(0, 0), new Vector2(0, 0));
    is_grounded = false;
    is_ducking = false;
    is_on_platform = false;
    last_platform = undefined;

    should_apply_duck_fall_multiplier = false;
    should_apply_low_jump_multiplier = false;

    constructor(physics_info) {
        super();

        this.physics_data = physics_info;
        this.maxVel.x = this.physics_data["max_x_velocity"] || 100;
    }

    get #width() {
        return this.physics_data["width"];
    }
    
    get #height() {
        return this.physics_data["height"];
    }

    getCenter(transform) {
        return new Vector2(
            transform.position.x + this.physics_data["width"] / 2,
            transform.position.y + this.physics_data["height"] / 2
        );
    }

    fixedUpdate(transform, fixed_delta_time)
    {
        this.#checkGrounded(transform, fixed_delta_time);
        this.#updateVelocities(fixed_delta_time);
    }

    update(transform, delta_time)
    {
        this.#updatePosition(transform, delta_time);
    }
    
    #updatePosition(transform, delta_time) {
        transform.position.add(this.vel.scale(delta_time));
        this.vel.x = lerp(this.vel.x, 0, this.physics_data["x_friction"]);
    }


    #updateVelocities(fixed_delta_time) {
        if (!this.is_grounded){
            this.vel.y += this.physics_data["gravity"] * fixed_delta_time;
            }
        else
            this.vel.y = Math.min(0, this.vel.y);

        if (this.vel.y > 0) {
            this.vel.y += this.physics_data["fall_multiplier"] * fixed_delta_time;

            if (this.should_apply_duck_fall_multiplier)
                this.vel.y += this.physics_data["fall_multiplier"] * fixed_delta_time * 0.7;
        }
        else if (this.vel.y < 0 && this.should_apply_low_jump_multiplier)
            this.vel.y += this.physics_data["low_jump_multiplier"] * fixed_delta_time;
        
        this.vel.x = clamp(this.vel.x, -this.maxVel.x, this.maxVel.x);

        if (Math.abs(this.vel.x) < 50 && this.vel.x != 0)
            this.vel.x = 0;
    }

    #checkGrounded(transform,fixed_delta_time) {
        if (this.vel.y < 0) {
            this.is_grounded = false;
            return;
        }
        if(!this.physics_data) return;
        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();
        
        // INFO: remove magic numbers
        const groundcast_left_x = this.getCenter(transform).x - this.#width / 2 + this.vel.x * fixed_delta_time + 10;
        const groundcast_right_x = this.getCenter(transform).x + this.#width / 2 + this.vel.x * fixed_delta_time + 30;

        const player_bottom_y = transform.position.y  + this.#height + this.vel.y * fixed_delta_time;
        
        this.groundcast_left = new Line(
            new Vector2(groundcast_left_x, player_bottom_y),
            new Vector2(groundcast_left_x, Math.max(player_bottom_y + 10, player_bottom_y + this.vel.y * fixed_delta_time * 15))
        );

        this.groundcast_right = new Line(
            new Vector2(groundcast_right_x, player_bottom_y),
            new Vector2(groundcast_right_x, Math.max(player_bottom_y + 10, player_bottom_y + this.vel.y * fixed_delta_time * 15))
        );

        for (const col_box of col_boxes) {
            if (col_box.ld.y < transform.position.y + this.#height - 10) continue;
            if (col_box === this.last_platform && this.is_ducking) continue;
            if (col_box.collidesWithGroundcast(this.groundcast_left) || col_box.collidesWithGroundcast(this.groundcast_right)) {
                const ground_y = col_box.ru.y - this.#height; 
                
                if (transform.position.y + this.vel.y * fixed_delta_time > ground_y - this.#height / 2 || this.vel.y <= 0) {
                    transform.position.y = ground_y;
                    this.vel.y = Math.min(this.vel.y, 0);
                    this.jumps_left = this.physics_data["jumps"];

                    this.is_grounded = true;
                    this.is_ducking = false;
                    
                    if (col_box.is_platform) {
                        this.is_on_platform = true;
                        this.last_platform = col_box;
                    }

                    return;
                }
            }
        }

        // character should have one more jump when jumping from ground
        if (this.is_grounded)
            this.jumps_left = this.physics_data["jumps"] - 1;
        
        this.is_grounded = false;
        this.is_on_platform = false;
    }


    jump() {
        if (this.jumps_left > 0) {
            this.vel.y = this.physics_data["jump_force"] * -1;
            this.jumps_left--;
            this.is_grounded = false;
        }
    }

    duck() {
        if (this.is_grounded && this.is_on_platform)
            this.is_ducking = true;
    }
}