// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import Transform from "./Transform.js";
import TransformComponent from "./Components/TransformComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import EntityManager from "./Singletons/EntityManager.js";
import AnimationComponent from "./Components/AnimationComponent.js";

export default class Entity {
    name = "";
    components = [];

    // This contructor constructs the class instance!
    constructor(start_x, start_y, entity_data, is_state_machine) {
        this.#setEntityData(start_x, start_y, entity_data, is_state_machine);
    }
    
    #setEntityData(start_x, start_y, entity_data, is_state_machine) {
        try {
            // find the right json data for this entity based on the name
            this.name = entity_data["name"];
            
            const width = entity_data["entity_info"]["width"];
            const height = entity_data["entity_info"]["height"];
            
            // Initialize Rendering and Physics Components with entity data
            this.components.push(new TransformComponent(new Transform(new Vector2(start_x, start_y)), width, height));
            this.components.push(new AnimationComponent(entity_data, is_state_machine));
            this.components.push(new RenderingComponent());
            this.components.push(new PhysicsComponent(entity_data["entity_info"]));
        } catch (err) {
            console.error("Error fetching entity data:\n", err);
        }
    }
    
    getComponentOfType(type) {
        for (const c of this.components)
            if (c.constructor === type)
                return c;

        return null;
    }

    get transform() { return this.getComponentOfType(TransformComponent).transform; }

    update() {}
    fixedUpdate() {}

    // entities only add themselves to the game once they have fetched all their data
    onLoaded() {
        EntityManager.getInstance(EntityManager).addEntity(this);
    }
};