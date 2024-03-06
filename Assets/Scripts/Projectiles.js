import PhysicsComponent from "./Components/PhysicsComponent";
import Vector2 from "../Vector2.js";
import Entity from "./Entity";
import RenderingComponent from "./Components/RenderingComponent.js";



export default class Projectile extends Entity{
    projectile_lifetime = 0;
    
    constructor(start_x, start_y, name, lifetime){
        super(start_x, start_y, name);
        this.projectile_lifetime = lifetime;
    }

    updateLifetime(delta) {
        lifetime -= delta;
        if (lifetime <= 0) this.#destroy();
    }

    #destroy() {
        EntityManager.getInstance(EntityManager).removeProjectile(this);
    }

    onLoaded() {
        EntityManager.getInstance(EntityManager).addProjectiles(this);

        this.getComponentOfType(RenderingComponent).render_collision = true;
        this.getComponentOfType(PhysicsComponent).vel = new Vector2.fromJSON((this.getComponentOfType(PhysicsComponent).physics_data[velocity]));
    }
}