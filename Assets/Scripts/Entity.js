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
    entity_name = "";
    components = [];

    // This contructor constructs the class instance!
    constructor(start_x, start_y, name) {
        this.entity_name = name;

        this.#setEntityData(start_x, start_y);
    }
    
    #setEntityData(start_x, start_y) {
        fetch('Assets/players.json')
        .then(res => res.json())
        .then(data => {
            // find the right json data for this entity based on the name
            const result = data.find(e => e.name === this.entity_name)
            
            const width = result["entity_info"]["width"];
            const height = result["entity_info"]["height"];
            
            // Initialize Rendering and Physics Components with entity data
            this.components.push(new TransformComponent(new Transform(new Vector2(start_x, start_y)), width, height));
            this.components.push(new AnimationComponent(result));
            this.components.push(new RenderingComponent());
            this.components.push(new PhysicsComponent(result["entity_info"]));
            
            this.onLoaded();
        })
        .catch(err => console.error("Error getting frame data:\n", err));
    }

    get transform() { return this.getComponentOfType(TransformComponent).transform; }
    
    getComponentOfType(type) {
        for (const c of this.components)
            if (c.constructor === type)
                return c;

        return null;
    }

    update() {}
    fixedUpdate() {}

    // entities only add themselves to the game once they have fetched all their data
    onLoaded() {
        EntityManager.getInstance(EntityManager).addEntity(this);
    }
};