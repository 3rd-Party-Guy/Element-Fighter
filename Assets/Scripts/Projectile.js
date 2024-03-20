import PhysicsComponent from "./Components/PhysicsComponent.js";
import Vector2 from "./Vector2.js";
import Entity from "./Entity.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import EntityManager from "./Singletons/EntityManager.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import TransformComponent from "./Components/TransformComponent.js";

export default class Projectile extends Entity {
    life_time = 0;
    is_flipped = false;
    owner = undefined;
    combat_data = undefined;

    constructor(owner, start_x, start_y, projectile_data, flipped) {
        super(start_x, start_y, projectile_data, false);
        
        this.life_time = projectile_data["entity_info"]["life_time"];
        this.is_flipped = flipped;
        this.owner = owner;
        this.combat_data = projectile_data["combat_info"];

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

    onCollision(player, delta) {
        if (this.combat_data["is_one_shot"] && this.is_registered) return;

        if(this.name == "Bubble")
        {
            let physics_component = this.getComponentOfType(PhysicsComponent);
            physics_component.vel = new Vector2(0,0);
            let player_transform = player.getComponentOfType(TransformComponent);
            let player_width = player_transform.width;
            let transform_component = this.getComponentOfType(TransformComponent);
            let animation_component = this.getComponentOfType(AnimationComponent);
            
            if(animation_component.is_flipped)
            {
                transform_component.position.x = transform_component.position.x -player_width/2;
            }
            else
            {
                transform_component.position.x = transform_component.position.x +player_width/2;
            }

            
        }
        this.is_registered = true;
        this.#damageEnemy(player, delta);
        this.#knockbackEnemy(player);
    }

    #damageEnemy(player, delta) {
        const damage_amount = (this.combat_data["is_one_shot"]) ? this.combat_data["damage"] : this.combat_data["damage"] * delta;
        player.damage(damage_amount);
    }

    #knockbackEnemy(player) {
        const kb_data = this.combat_data.knockback_info;
        if (!kb_data.has_knockback) return;

        const physics_comp = player.getComponentOfType(PhysicsComponent);

        physics_comp.vel.x = kb_data.multiplier_x;
        physics_comp.vel.y -= kb_data.multiplier_y;

        if (this.is_flipped)
            physics_comp.vel.x *= -1;
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