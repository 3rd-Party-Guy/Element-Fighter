import PhysicsComponent from "./Components/PhysicsComponent.js";
import Vector2 from "./Vector2.js";
import Entity from "./Entity.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import EntityManager from "./Singletons/EntityManager.js";



export default class Projectile extends Entity{
    projectile_lifetime = 0;
    
    constructor(start_x, start_y, projectile_data, lifetime){
        super(start_x, start_y, projectile_data);
        this.projectile_lifetime = lifetime;
        this.onLoaded();
    }

    updateLifetime(fixed_delta_time)
    {
        lifetime -= fixed_delta_time;
        if(lifetime <= 0) this.#destroy();
    }

    #destroy(){
        EntityManager.getInstance(EntityManager).removeProjectile(this);
    }

    onLoaded() {
        this.#setInitialData();
        EntityManager.getInstance(EntityManager).addProjectile(this);
    }

    #setInitialData()
    {
        let physics_component = this.getComponentOfType(PhysicsComponent);
        physics_component.vel = Vector2.fromJSON((this.getComponentOfType(PhysicsComponent).physics_data["velocity"]));
        physics_component.can_jump = false;
        physics_component.has_gravity = false;
        let animation_component = this.getComponentOfType(AnimationComponent);
        animation_component.can_attack = false;
    }

}