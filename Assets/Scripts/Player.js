import Vector2 from "./Vector2.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import TransformComponent from "./Components/TransformComponent.js";
import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";
import Entity from "./Entity.js";
import Projectile from "./Projectile.js";
import EntityManager from "./Singletons/EntityManager.js";
import { AttackModes } from "./StateMachine.js";
import { clamp } from "./Utilities.js";

export default class Player extends Entity {
    is_jumping = false;
    is_ducking = false;

    is_attacking_light = false;
    is_attacking_heavy = false;
    is_ability_one = false;
    is_ability_two = false;

    combat_data = undefined;
    ability_data = undefined;

    sounds_path = undefined;

    health = 100;
    mana = 100;
    avatar_path = "";

    is_attack_registered = false;
    last_attack_state = undefined;

    mana_regen_rate = 0;

    is_controllable = true;

    // Fetches all needed JSON data
    // Adds all additional needed components that default entities lack
    constructor(start_x, start_y, player_data, ability_data) {
        super(start_x, start_y, player_data, true);

        this.combat_data = player_data["combat_info"];
        this.ability_data = ability_data;
        this.sounds_path = player_data["sound_paths"];
        
        this.light_damage = player_data["entity_info"]["light_damage"];
        this.heavy_damage = player_data["entity_info"]["heavy_damage"];

        this.avatarPath = player_data["avatar_path"];
        this.mana_regen_rate = player_data["mana_regen_rate"];

        this.addComponent(new AudioPlayerComponent());
        this.addComponent(new PhysicsComponent(player_data["entity_info"]));

        this.onLoaded();
    }
    
    // A getter function. Returns the animation component's current attack state
    get attackState() {
        return this.getComponentOfType(AnimationComponent).attack_state.current_state;
    }

    // A getter function. isAttacking is determined based on the animation component's current attack state
    // This is because our combat collision system is based on visual collision calculation
    get isAttacking() {
        return (this.attackState != AttackModes.None);
    }

    // Returns all attacking data as an object
    get attackingData() {
        return {
            is_attacking: this.isAttacking,
            attacking_light: this.is_attacking_light,
            attacking_heavy: this.is_attacking_heavy,
            using_ability_one: this.is_ability_one,
            using_ability_two: this.is_ability_two
        };
    }

    get current_damage() {
        let current_damage = 0;

        if (this.attackState === AttackModes.AttackLight)
            current_damage = this.combat_data.light_damage;
        else if (this.attackState === AttackModes.AttackHeavy)
            current_damage = this.combat_data.heavy_damage;

        return current_damage;
    }
    
    // onLoaded is called after all data is fed and all components are initialized
    onLoaded() {
        this.#setProperties();
        EntityManager.getInstance(EntityManager).addPlayer(this);
    }
    
    // Set Properties configures all components
    #setProperties() {
        this.getComponentOfType(RenderingComponent).render_collision = true;
        this.getComponentOfType(PhysicsComponent).snap_stop_x = true;
    }

    // Called by other enities to damage the player
    damage(amount) {
        this.health -= amount;

        this.health = clamp(this.health, 0, 100);
        this.getComponentOfType(AudioPlayerComponent).playOneShot(this.sounds_path + "hurt.wav");
    }

    // Clears all attack signals for the player
    // These signals are different each frame
    clearAttackSignals() {
        this.is_attacking_light = false;
        this.is_attacking_heavy = false;
        this.is_ability_one = false;
        this.is_ability_two = false;
    }

    // Regenerates mana and clamps it to a range
    fixedUpdate(delta) {
        this.mana += this.mana_regen_rate * delta;
        this.mana = clamp(this.mana, 0, 100);
    }

    // Makes sure that new attacks start off as unregistered
    update(delta) {
        if (this.last_attack_state !== this.attackState)
            this.is_attack_registered = false;

        this.last_attack_state = this.attackState;
    }

    // Called when the player presses the light attack button
    attackLight() {
        if(!this.is_controllable)return;
        this.is_attacking_light = true;
        this.getComponentOfType(AudioPlayerComponent).playOneShot(this.sounds_path + "light_attack.wav");
    }
    
    // Called when the player presses the heavy attack button
    attackHeavy() {
        if(!this.is_controllable)return;
        this.is_attacking_heavy = true;
        this.getComponentOfType(AudioPlayerComponent).playOneShot(this.sounds_path + "heavy_attack.wav");

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
                new Projectile(
                    this, start_pos.x, start_pos.y, this.ability_data["heavy_pre"], is_flipped
                );
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
                new Projectile(
                    this, start_pos.x, start_pos.y, this.ability_data["heavy"], is_flipped
                );
            }, this.ability_data["heavy"]["entity_info"]["cast_time"] * 1000);
        }
    }
    
    // Called when the player presses the ability one button
    abilityOne() {
        if(!this.is_controllable)return;
        if(this.mana < this.ability_data.ability_one.combat_info.cost)
            return;
    
        this.getComponentOfType(AudioPlayerComponent).playOneShot(this.sounds_path + "ability_one.wav");

        this.is_ability_one = true;
        this.mana -= this.ability_data.ability_one.combat_info.cost;

        this.#spawnAbility(this.ability_data["ability_one"]);
    }

    // Called when the player presses the ability two button
    abilityTwo() {
        if(!this.is_controllable)return;
        if(this.mana < this.ability_data.ability_two.combat_info.cost)
            return;
    
        this.getComponentOfType(AudioPlayerComponent).playOneShot(this.sounds_path + "ability_two.wav");

        this.is_ability_two = true;
        this.mana -= this.ability_data.ability_two.combat_info.cost;

        this.#spawnAbility(this.ability_data["ability_two"]);
    }

    // This event is called when the collision system determines that this player is attacking another
    // Only called on melee attacks
    onAttack(other_player) {
        if (this.is_attack_registered) return;

        this.is_attack_registered = true;
        other_player.damage(this.current_damage);

        this.#knockbackEnemy(other_player);
    }

    // Calculates the knockback amount and applies it to the other player's physics component
    #knockbackEnemy(other_player) {
        if(!this.is_controllable)return;
        const kb_data = this.combat_data.knockback_info;
        const physics_comp = other_player.getComponentOfType(PhysicsComponent);

        const kb_vel_x = (this.attackState === AttackModes.AttackLight) ? kb_data.light.multiplier_x : kb_data.heavy.multiplier_x;
        const kb_vel_y = (this.attackState === AttackModes.AttackLight) ? kb_data.light.multiplier_y : kb_data.heavy.multiplier_y;

        physics_comp.vel.x = kb_vel_x;
        physics_comp.vel.y = kb_vel_y * -1;

        if (this.getComponentOfType(AnimationComponent).is_flipped)
            physics_comp.vel.x *= -1;
    }

    // Calculates the position of the projectile and accounts for cast time
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
            new Projectile(
                this, start_pos.x, start_pos.y, ability_data, is_flipped
            );
        }, ability_data["entity_info"]["cast_time"] * 1000);
    }
}