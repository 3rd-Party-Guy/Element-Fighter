// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import TransformComponent from "./Components/TransformComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import EntityManager from "./Singletons/EntityManager.js";
import AnimationComponent from "./Components/AnimationComponent.js";

export default class Entity {
    name = "";
    components = {};

    // This contructor constructs the class instance!
    constructor(start_x, start_y, entity_data, is_state_machine) {
        this.#setEntityData(start_x, start_y, entity_data, is_state_machine);
    }
    
    // Adds components and fetches the necessary data
    #setEntityData(start_x, start_y, entity_data, is_state_machine) {
        try {
            // find the right json data for this entity based on the name
            this.name = entity_data["name"];
            
            const width = entity_data["entity_info"]["width"];
            const height = entity_data["entity_info"]["height"];
            
            // Initialize Rendering and Physics Components with entity data
            this.addComponent(new TransformComponent(new Vector2(start_x, start_y), width, height));
            this.addComponent(new AnimationComponent(entity_data, is_state_machine));
            this.addComponent(new RenderingComponent());
        } catch (err) {
            console.error("Error fetching entity data:\n", err);
        }
    }

    // Adds a component only if it is not already present in the components object
    addComponent(comp) {
        const type_key = Symbol.for(comp.constructor.name);
        
        // Entities can and should only have one component per type
        if (!this.components[type_key])
            this.components[type_key] = comp;
    }
    
    // Searches the lookup for a constructor of the same name
    getComponentOfType(type) {
        const type_key = Symbol.for(type.name);
        return this.components[type_key] || null;
    }

    // Removes component from the components object
    removeComponentOfType(type) {
        const type_key = Symbol.for(type);
        delete this.components[type_key];
    }

    get transform() { return this.getComponentOfType(TransformComponent); }

    // All entities have their own gameloop methods
    earlyUpdate() {}
    update() {}
    fixedUpdate() {}
    lateUpdate() {}

    // entities only add themselves to the entity manager once they have fetched all their data
    onLoaded() {
        EntityManager.getInstance(EntityManager).addEntity(this);
    }
};