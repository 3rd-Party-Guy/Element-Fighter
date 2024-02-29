import RenderingComponent from "./Components/RenderingComponent.js";
import Entity from "./Entity.js";
import EntityManager from "./Singletons/EntityManager.js";
import State, { MovementState, MovementModes, AttackState, AttackModes } from "./StateMachine.js";

export default class Player extends Entity {
    movement_state = undefined;
    attack_state = undefined;
    state = undefined;

    is_attacking_light = false;
    is_attacking_heavy = false;
    is_ability_one = false;
    is_ability_two = false;

    constructor(start_x, start_y, name) {
        super(start_x, start_y, name);

        this.movement_state = new MovementState();
        this.attack_state = new AttackState();
    }

    // INFO: needed?
    get animation_state() {
        return this.state;
    }

    get is_attacking() {
        return (this.is_attacking_light || this.is_attacking_heavy || this.is_ability_one || this.is_ability_two);
    }

    onLoaded() {
        EntityManager.getInstance(EntityManager).addPlayer(this);
    }

    setState() {
        this.state = (this.attack_state.current_state == AttackModes.None) ? this.movement_state : this.attack_state;
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