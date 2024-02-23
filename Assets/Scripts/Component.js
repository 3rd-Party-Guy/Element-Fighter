/// Author:         Leon Enders
/// Description:    An abstract class for the Components in the Entity Component System followed by concrete classes of inerhiting from component afterwards. These are used to manage behaviour of entities, for different game domains.

import { clamp, lerp } from "./Math.js";
import Vector2 from "./Vector2.js";
import MapColliderManager from "./MapColliderManager.js";
import InputManager from "./InputManager.js";
import Line from "./Line.js";



// Base Class for Components, shared behaviour for all components will be implemented here
// implements behaviour for a specific domain to decouple from entity
// Create Child classes for each domains behaviour, to decouple most of the behaviour from entity (Currently: Transform Component, Physics Component, Rendering Component)



export class Component {


    constructor()
    {
        if(this.constructor == Component)
        {
            throw new Error("Abstract classes can\'t be instantiated.");
        }
    }

   
    initComponent()
    {
        throw new Error("Method \'initComponent()\' must be implemented")
    }

    
    fixedUpdate()
    {
        
        throw new Error("Method \'fixedUpdate()\' must be implemented");
        
    }

  
    update()
    {
        throw new Error("Method \'update()\' must be implemented");
    }

}



export class TransformComponent extends Component {

    transform = undefined;


    initComponent(start_transform)
    {
        this.transform = start_transform;
    }

}

export class PhysicsComponent extends Component {


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

    // called to initialize component
    initComponent(physics_info)
    {
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
        if (!this.physics_data) return;

       
        transform.position.x += this.vel.x * delta_time;
        transform.position.y += this.vel.y * delta_time;

        if (this.vel.x < 0) this.is_flipped = true;
        else if (this.vel.x > 0) this.is_flipped = false;

        this.vel.x = lerp(this.vel.x, 0, this.physics_data["x_friction"]);
    }


    #updateVelocities(fixed_delta_time) {
        if (!this.physics_data) return;
        
        if (!this.is_grounded){
            this.vel.y += this.physics_data["gravity"] * fixed_delta_time;
            }
        else
            this.vel.y = Math.min(0, this.vel.y);

        if (this.vel.y > 0)
            this.vel.y += this.physics_data["fall_multiplier"] * fixed_delta_time;
        if (this.vel.y < 0 && !InputManager.getInstance(InputManager).isKeyActive("KeyW"))
            this.vel.y += this.physics_data["low_jump_multiplier"] * fixed_delta_time;

        
        this.vel.x = clamp(this.vel.x, -this.maxVel.x, this.maxVel.x);

        if(Math.abs(this.vel.x) < 10 && this.vel.x != 0)
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
            new Vector2(groundcast_left_x, Math.max(player_bottom_y + 10, player_bottom_y + this.vel.y * fixed_delta_time * 25))
        );

        this.groundcast_right = new Line(
            new Vector2(groundcast_right_x, player_bottom_y),
            new Vector2(groundcast_right_x, Math.max(player_bottom_y + 10, player_bottom_y + this.vel.y * fixed_delta_time * 25))
        );

        for (const col_box of col_boxes) {
            if (col_box.ld.y < transform.position.y + this.#height - 10) continue;
            if (col_box === this.last_platform && this.is_ducking) continue;
            if (col_box.collidesWithGroundcast(this.groundcast_left) || col_box.collidesWithGroundcast(this.groundcast_right)) {
                const ground_y = col_box.ru.y - this.#height; 
                console.log(col_box.is_platform);
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
        if (this.is_grounded || this.jumps_left > 0) {
            this.vel.y = this.physics_data["jump_force"] * -1;
            this.jumps_left--;
            this.is_grounded = false;
        }
    }

    duck() {
        if (this.is_grounded && this.is_on_platform) {
            this.is_ducking = true;
        }
    }
}




class RenderingComponent extends Component {

    

}
