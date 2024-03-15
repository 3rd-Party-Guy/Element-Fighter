/// Author:         Leon Enders, Nikolay Hadzhiev
/// Description:    An inherited Component class handling the physics domain, implementing behaviour for entities.

import { clamp, lerp } from "../Math.js";
import Vector2 from "../Vector2.js";
import Line from "../Line.js";
import Component from "./Component.js";
import MapColliderManager from "../Singletons/MapColliderManager.js";

export default class PhysicsComponent extends Component {
    // Property to hold all relevant physics data for an entity
    physics_data = undefined;

    // Properties for calculating physics
    vel = new Vector2(0,0);
    maxVel = new Vector2(100,0);

    x_friction = 0;
    y_friction = 0;
    
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

    duck_fall_multiplier = 0.9;

    should_move = true;

    should_apply_duck_fall_multiplier = false;
    should_apply_low_jump_multiplier = false;

    snap_stop_x = false;

    //Component flags for entities
    can_jump = true;
    has_gravity = true;

    constructor(physics_info) {
        super();

        this.physics_data = physics_info;
        this.maxVel.x = this.physics_data["max_x_velocity"] || 100;
    }

    getCenter(transform) {
        return new Vector2(
            transform.position.x + this.physics_data["width"] / 2,
            transform.position.y + this.physics_data["height"] / 2
        );
    }

    fixedUpdate(transform, width, height, is_jumping, is_ducking, fixed_delta_time)
    {
        this.should_apply_low_jump_multiplier = !is_jumping;
        this.should_apply_duck_fall_multiplier = is_ducking;

        this.#updateLastPlatform(transform, height);
        this.#checkGrounded(transform, width, height, fixed_delta_time);
        this.#updateVelocities(fixed_delta_time);
    }

    update(transform, delta_time)
    {
        this.#updatePosition(transform, delta_time);
    }
    
    #updatePosition(transform, delta_time) {
        if (!this.should_move) return;

        transform.position.add(this.vel.scale(delta_time));
        this.vel.x = lerp(this.vel.x, 0, this.physics_data["x_friction"]);
    }

    #updateVelocities(fixed_delta_time) {
        if (!this.is_grounded && this.has_gravity)
            this.vel.y += this.physics_data["gravity"] * fixed_delta_time;
        else
            this.vel.y = Math.min(0, this.vel.y);

        if(this.has_gravity)
        {
            if (this.vel.y > 0)
            this.vel.y += this.physics_data["fall_multiplier"] * fixed_delta_time;
        
            if (this.should_apply_duck_fall_multiplier)
            this.vel.y += this.physics_data["fall_multiplier"] * fixed_delta_time * this.duck_fall_multiplier;
        
        }
        if(this.can_jump)
        {
            if (this.vel.y < 0 && this.should_apply_low_jump_multiplier)
            this.vel.y += this.physics_data["low_jump_multiplier"] * fixed_delta_time;
        }
        
        
        this.vel.x = clamp(this.vel.x, -this.maxVel.x, this.maxVel.x);

        if (this.snap_stop_x) {
            if (Math.abs(this.vel.x) < 50 && this.vel.x != 0)
                this.vel.x = 0;
        }
    }

    #checkGrounded(transform, width, height, fixed_delta_time) {
        if (!this.has_gravity) return;

        if (this.vel.y < 0) {
            this.is_grounded = false;
            return;
        }
        if(!this.physics_data) return;
        const col_boxes = MapColliderManager.getInstance(MapColliderManager).getBoxes();
        
        // INFO: remove magic numbers
        const groundcast_left_x = this.getCenter(transform).x - width / 2 + this.vel.x * fixed_delta_time + 10;
        const groundcast_right_x = this.getCenter(transform).x + width / 2 + this.vel.x * fixed_delta_time + 30;

        const player_bottom_y = transform.position.y  + height + this.vel.y * fixed_delta_time;
        
        this.groundcast_left = new Line(
            new Vector2(groundcast_left_x, player_bottom_y),
            new Vector2(groundcast_left_x, Math.max(player_bottom_y + 10, player_bottom_y + this.vel.y * fixed_delta_time * 15))
        );

        this.groundcast_right = new Line(
            new Vector2(groundcast_right_x, player_bottom_y),
            new Vector2(groundcast_right_x, Math.max(player_bottom_y + 10, player_bottom_y + this.vel.y * fixed_delta_time * 15))
        );

        for (const col_box of col_boxes) {
            if (col_box.ld.y < transform.position.y + height - 10) continue;
            if (col_box === this.last_platform && this.is_ducking) continue;
            if (col_box.collidesWithGroundcast(this.groundcast_left) || col_box.collidesWithGroundcast(this.groundcast_right)) {
                const ground_y = col_box.ru.y - height; 
                
                if (transform.position.y + this.vel.y * fixed_delta_time > ground_y - height / 2 || this.vel.y <= 0) {
                    transform.position.y = ground_y;
                    this.vel.y = Math.min(this.vel.y, 0);
                    if(this.can_jump)
                    this.jumps_left = this.physics_data["jumps"] || 0;

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
        if(this.can_jump)
        {
            if (this.is_grounded)
            this.jumps_left = this.physics_data["jumps"] - 1 || 0;
        
            this.is_grounded = false;
            this.is_on_platform = false;
        }
        
    }

    // If the player is above the platform the ducked from, they can land back on it
    #updateLastPlatform(transform, height) {
        if (!this.last_platform) return;

        if (transform.position.y + height < this.last_platform.ru.y)
            this.last_platform = undefined;
    }

    jump() {
        if (this.jumps_left > 0) {
            this.vel.y = this.physics_data["jump_force"] * -1 || 0;
            this.jumps_left--;
            this.is_grounded = false;
        }
    }

    duck() {
        if (this.is_grounded && this.is_on_platform)
            this.is_ducking = true;
    }
}