// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import Transform from "./Transform.js";
import TransformComponent from "./Components/TransformComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import EntityManager from "./Singletons/EntityManager.js";

export default class Entity {
    entity_name = "Knight";
    components = [];

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.components.push(new TransformComponent(new Transform(new Vector2(startX, startY))));
        this.#setEntityData();
    }

    get transform() { return this.getComponentOfType(TransformComponent).transform; }

    #setEntityData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                // find the right json data for this entity based on the name
                const result = data.find(e => e.name === this.entity_name)
                
                // Initialize Rendering and Physics Components with entity data
                this.components.push(new RenderingComponent(result));
                this.components.push(new PhysicsComponent(result["character_info"]));

                this.onLoaded();
            })
            .catch(err => console.error("Error getting frame data:\n", err));
    }
    
    getComponentOfType(type) {
        for (const c of this.components)
            if (c.constructor === type)
                return c;

        return null;
    }

    // entities only add themselves to the game once they have fetched all their data
    onLoaded() {
        EntityManager.getInstance(EntityManager).addEntity(this);
    }
};