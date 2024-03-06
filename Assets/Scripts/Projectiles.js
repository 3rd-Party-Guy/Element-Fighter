import PhysicsComponent from "./Components/PhysicsComponent";
import Vector2 from "../Vector2.js";
import Entity from "./Entity";



export default class Projectile extends Entity{
    projectile_lifetime = 0;
    
    constructor(start_x, start_y, name, lifetime){
        this.projectile_lifetime = lifetime;
        super(start_x, start_y, name);
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
        EntityManager.getInstance(EntityManager).addProjectiles(this);
        this.#SetInitialData();
    }

    #SetInitialData()
    {
        this.getComponentOfType(PhysicsComponent).vel = new Vector2.fromJSON((this.getComponentOfType(PhysicsComponent).physics_data[velocity]));

    }

}