import Vector2 from "./Vector2.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import TransformComponent from "./Components/TransformComponent.js";
import Entity from "./Entity.js";
import Projectile from "./Projectile.js";
import EntityManager from "./Singletons/EntityManager.js";
import { AttackModes } from "./StateMachine.js";
import { clamp } from "./Math.js";

export default class Player extends Entity {
    is_jumping = false;
    is_ducking = false;

    is_attacking_light = false;
    is_attacking_heavy = false;
    is_ability_one = false;
    is_ability_two = false;

    combat_data = undefined;
    ability_data = undefined;

    health = 100;
    mana = 100;
    avatar_path = "";

    is_attack_registered = false;
    last_attack_state = undefined;

    mana_regen_rate = 0;

    constructor(start_x, start_y, player_data, ability_data) {
        super(start_x, start_y, player_data, true);

        this.combat_data = player_data["combat_info"];
        this.ability_data = ability_data;
        
        this.light_damage = player_data["entity_info"]["light_damage"];
        this.heavy_damage = player_data["entity_info"]["heavy_damage"];

        this.avatarPath = player_data["avatar_path"];
        this.mana_regen_rate = player_data["mana_regen_rate"];

        this.onLoaded();
    }
    
    get isAttacking() {
        return (this.getComponentOfType(AnimationComponent).attack_state.current_state != AttackModes.None);
    }
    
    get attackState() {
        return this.getComponentOfType(AnimationComponent).attack_state.current_state;
    }

    get attackingData() {
        return {
            is_attacking: this.isAttacking,
            attacking_light: this.is_attacking_light,
            attacking_heavy: this.is_attacking_heavy,
            using_ability_one: this.is_ability_one,
            using_ability_two: this.is_ability_two
        };
    }
    
    onLoaded() {
        this.#setProperties();
        EntityManager.getInstance(EntityManager).addPlayer(this);
    }
    
    #setProperties() {
        this.getComponentOfType(RenderingComponent).render_collision = true;
        this.getComponentOfType(PhysicsComponent).snap_stop_x = true;
    }

    get damage() {
        let current_damage = 0;

        if (this.attackState === AttackModes.AttackLight)
            current_damage = this.combat_data.light_damage;
        else if (this.attackState === AttackModes.AttackHeavy)
            current_damage = this.combat_data.heavy_damage;

        return current_damage;
    }

    clearAttackSignals() {
        this.is_attacking_light = false;
        this.is_attacking_heavy = false;
        this.is_ability_one = false;
        this.is_ability_two = false;
    }

    fixedUpdate(delta) {
        this.mana += this.mana_regen_rate * delta;
        this.mana = clamp(this.mana, 0, 100);
    }

    update(delta) {
        if (this.last_attack_state !== this.attackState)
            this.is_attack_registered = false;

        this.last_attack_state = this.attackState;
    }

    attackLight() {
        this.is_attacking_light = true;
    }
    
    attackHeavy() {
        this.is_attacking_heavy = true;

        if (this.name === "Mermaid") {
            const is_flipped = this.getComponentOfType(AnimationComponent).is_flipped;
            const transform = this.getComponentOfType(TransformComponent);
            
            let start_pos = new Vector2(0, 0);
            let ability_width = this.ability_data["heavy_pre"]["entity_info"]["width"];
    
            setTimeout(() => {
                start_pos.x = transform.position.x;
    
                if (is_flipped)
                    start_pos.x -= ability_width;
                else
                    start_pos.x += transform.width;
    
                start_pos.y = transform.position.y;
                EntityManager.getInstance(EntityManager).addProjectile(
                    new Projectile(
                        this, start_pos.x, start_pos.y, this.ability_data["heavy_pre"], is_flipped
                    ));
            }, this.ability_data["heavy_pre"]["entity_info"]["cast_time"] * 1000);
            
            let start_pos_bolt = new Vector2(0, 0);
            let ability_width_bolt = this.ability_data["heavy"]["entity_info"]["width"];
    
            setTimeout(() => {
                start_pos_bolt.x = transform.position.x;
    
                if (is_flipped)
                    start_pos_bolt.x -= ability_width_bolt;
                else
                    start_pos_bolt.x += transform.width;
    
                start_pos_bolt.y = transform.position.y;
                EntityManager.getInstance(EntityManager).addProjectile(
                    new Projectile(
                        this, start_pos.x, start_pos.y, this.ability_data["heavy"], is_flipped
                    )
                );
            }, this.ability_data["heavy"]["entity_info"]["cast_time"] * 1000);
        }
    }
    
    abilityOne() {
        if(this.mana < this.ability_data.ability_one.combat_info.cost)
            return;

        this.is_ability_one = true;
        this.mana -= this.ability_data.ability_one.combat_info.cost;

        this.#spawnAbility(this.ability_data["ability_one"]);
    }

    abilityTwo() {
        if(this.mana < this.ability_data.ability_two.combat_info.cost)
            return;

        this.is_ability_two = true;
        this.mana -= this.ability_data.ability_two.combat_info.cost;

        this.#spawnAbility(this.ability_data["ability_two"]);
    }

    #spawnAbility(ability_data) {
        const is_flipped = this.getComponentOfType(AnimationComponent).is_flipped;
        const transform = this.getComponentOfType(TransformComponent);

        let ability_width = ability_data["entity_info"]["width"];

        let start_pos = new Vector2(0, 0);
        start_pos.x = transform.position.x;

        if (is_flipped)
            start_pos.x -= ability_width;
        else
            start_pos.x += transform.width;

        start_pos.y = transform.position.y;


        setTimeout(() => {
            EntityManager.getInstance(EntityManager).addProjectile(
                new Projectile(
                    this, start_pos.x, start_pos.y, ability_data, is_flipped
                )
            );
        }, this.ability_data["ability_two"]["entity_info"]["cast_time"] * 1000);
    }
}