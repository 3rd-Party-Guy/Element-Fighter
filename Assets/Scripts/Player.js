import AnimationComponent from "./Components/AnimationComponent.js";
import Entity from "./Entity.js";
import EntityManager from "./Singletons/EntityManager.js";

export default class Player extends Entity {
    is_attacking_light = false;
    is_attacking_heavy = false;
    is_ability_one = false;
    is_ability_two = false;

    constructor(start_x, start_y, name) {
        super(start_x, start_y, name);
    }

    get isAttacking() {
        return (this.is_attacking_light || this.is_attacking_heavy || this.is_ability_one || this.is_ability_two);
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
        EntityManager.getInstance(EntityManager).addPlayer(this);
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
    }

    abilityTwo() {
        this.ability_two = true;
    }
}