import PhysicsComponent from "./Components/PhysicsComponent.js";
import Vector2 from "./Vector2.js";
import Entity from "./Entity.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import EntityManager from "./Singletons/EntityManager.js";
import RenderingComponent from "./Components/RenderingComponent.js";

export default class Projectile extends Entity {
    lifetime = 0;
    
    constructor(start_x, start_y, projectile_data, lifetime) {
        super(start_x, start_y, projectile_data, false);
        this.lifetime = lifetime;
        this.onLoaded();
    }

    fixedUpdate(fixed_delta) {
        this.#updateLifetime(fixed_delta);
    }
    
    #updateLifetime(fixed_delta) {
        this.lifetime -= fixed_delta;

        if (this.lifetime <= 0)
            this.#destroy();
    }

    #destroy() {
        EntityManager.getInstance(EntityManager).removeProjectile(this);
    }

    onLoaded() {
        this.#setProperties();
        EntityManager.getInstance(EntityManager).addProjectile(this);
    }

    #setProperties() {
        this.getComponentOfType(RenderingComponent).render_collision = true;

        let physics_component = this.getComponentOfType(PhysicsComponent);
        physics_component.vel = Vector2.fromJSON((this.getComponentOfType(PhysicsComponent).physics_data["velocity"]));
        physics_component.can_jump = false;
        physics_component.has_gravity = false;
        
        let animation_component = this.getComponentOfType(AnimationComponent);
        animation_component.can_attack = false;
    }
}