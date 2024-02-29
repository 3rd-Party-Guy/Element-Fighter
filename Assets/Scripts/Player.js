import RenderingComponent from "./Components/RenderingComponent.js";
import Entity from "./Entity.js";
import EntityManager from "./Singletons/EntityManager.js";

export default class Player extends Entity {
    is_attacking_light = false;
    is_attacking_heavy = false;
    is_ability_one = false;
    is_ability_two = false;

    get is_attacking() {
        return (this.is_attacking_light || this.is_attacking_heavy || this.is_ability_one || this.is_ability_two);
    }

    onLoaded() {
        EntityManager.getInstance(EntityManager).addPlayer(this);
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