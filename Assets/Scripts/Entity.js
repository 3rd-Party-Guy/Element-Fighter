// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import Transform from "./Transform.js";
import TransformComponent from "./Components/TransformComponent.js";
import PhysicsComponent from "./Components/PhysicsComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";

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
            })
            .catch(err => console.error("Error getting frame data:\n", err));
    }
    
    getComponentOfType(type) {
        for (const c of this.components)
            if (c.constructor === type)
                return c;

        return null;
    }

    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update(deltaTime) {
        this.getComponentOfType(PhysicsComponent)?.update(this.getComponentOfType(TransformComponent).transform, deltaTime);
        this.getComponentOfType(RenderingComponent)?.update(this.getComponentOfType(PhysicsComponent));
    }
    
    // The FixedUpdate function run withing a fixed and constant interval, resulting in FPS-independent logic
    fixedUpdate(fixedDeltaTime) {
        this.getComponentOfType(PhysicsComponent)?.fixedUpdate(this.getComponentOfType(TransformComponent).transform, fixedDeltaTime);
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
        this.getComponentOfType(RenderingComponent)?.render(this.transform, this.getComponentOfType(PhysicsComponent), ctx);
    }
};