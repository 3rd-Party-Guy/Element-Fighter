import PhysicsComponent from "./Components/PhysicsComponent.js";
import Vector2 from "./Vector2.js";
import Entity from "./Entity.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import EntityManager from "./Singletons/EntityManager.js";
import RenderingComponent from "./Components/RenderingComponent.js";

export default class Projectile extends Entity {
    life_time = 0;
    is_flipped = false;
    owner = undefined;
    damage = 0;

    constructor(owner, start_x, start_y, projectile_data, flipped) {
        super(start_x, start_y, projectile_data, false);
        
        this.life_time = projectile_data["entity_info"]["life_time"];
        
        this.is_flipped = flipped;
        this.owner = owner;
        this.damage = projectile_data["damage"];
        
        this.onLoaded();
    }

    fixedUpdate(fixed_delta) {
        this.#updateLifetime(fixed_delta);
    }
    
    #updateLifetime(fixed_delta) {
        this.life_time -= fixed_delta;

        if (this.life_time <= 0)
            this.#destroy();
    }

    #destroy() {
        EntityManager.getInstance(EntityManager).removeProjectile(this);
    }

    onLoaded() {
        this.#setProperties();
    }

    #setProperties() {
        this.getComponentOfType(RenderingComponent).render_collision = true;

        let physics_component = this.getComponentOfType(PhysicsComponent);
        let animation_component = this.getComponentOfType(AnimationComponent);
        animation_component.is_flipped = this.is_flipped;
        animation_component.can_attack = false;

        if(this.is_flipped)
            physics_component.vel = Vector2.fromJSON((this.getComponentOfType(PhysicsComponent).physics_data["velocity"])).scale(-1);
        else
            physics_component.vel = Vector2.fromJSON((this.getComponentOfType(PhysicsComponent).physics_data["velocity"]));

        physics_component.can_jump = false;
        physics_component.has_gravity = false;
    }
}