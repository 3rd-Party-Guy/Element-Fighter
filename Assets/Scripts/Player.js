import Vector2 from "./Vector2.js";
import AnimationComponent from "./Components/AnimationComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import TransformComponent from "./Components/TransformComponent.js";
import Entity from "./Entity.js";
import Projectile from "./Projectile.js";
import EntityManager from "./Singletons/EntityManager.js";
import { AttackModes } from "./StateMachine.js";

export default class Player extends Entity {
    is_attacking_light = false;
    is_attacking_heavy = false;
    is_ability_one = false;
    is_ability_two = false;

    ability_data = undefined;

    constructor(start_x, start_y, player_data) {
        super(start_x, start_y, player_data, true);
        this.#setAbilityData(player_data);
        this.onLoaded();
    }
    
    #setAbilityData(player_data) {
        this.ability_data = player_data["abilities_info"];
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

    clearAttackSignals() {
        this.is_attacking_light = false;
        this.is_attacking_heavy = false;
        this.is_ability_one = false;
        this.is_ability_two = false;
    }

    attackLight() {
        this.is_attacking_light = true;
    }
    
    attackHeavy() {
        this.is_attacking_heavy = true;
    }
    
    abilityOne() {
        this.is_ability_one = true;

        const is_flipped = this.getComponentOfType(RenderingComponent).is_flipped;
        const transform = this.getComponentOfType(TransformComponent);

        let start_pos = new Vector2(0, 0);
        start_pos.x = transform.transform.position.x;

        if (is_flipped)
            start_pos.x -= transform.width;
        else
            start_pos.x += transform.width;

        start_pos.y = transform.transform.position.y;

        EntityManager.getInstance(EntityManager).addProjectile(new Projectile(start_pos.x, start_pos.y, this.ability_data[0], 2, is_flipped));
    }

    abilityTwo() {
        this.ability_two = true;

        const is_flipped = this.getComponentOfType(RenderingComponent).is_flipped;
        const transform = this.getComponentOfType(TransformComponent);

        let start_pos = new Vector2(0, 0);
        start_pos.x = transform.transform.position.x;

        if (is_flipped)
            start_pos.x -= transform.width;
        else
            start_pos.x += transform.width;

        start_pos.y = transform.transform.position.y;

        EntityManager.getInstance(EntityManager).addProjectile(new Projectile(start_pos.x, start_pos.y, this.ability_data[1], 2, is_flipped));
    }
}