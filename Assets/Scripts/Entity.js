// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import Transform from "./Transform.js";
import { TransformComponent } from "./Component.js";
import { PhysicsComponent } from "./PhysicsComponent.js";
import { RenderingComponent} from "./RenderingComponent.js";

export default class Entity {
    entity_name = "Knight";

    // Creating Components
    transform_component = new TransformComponent();
    physics_component = new PhysicsComponent();
    rendering_component = new RenderingComponent();

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.transform_component.initComponent(new Transform(new Vector2(startX, startY)));
        this.#setEntityData();
    }

    #setEntityData() {
        fetch('Assets/entities.json')
            .then(res => res.json())
            .then(data => {
                // find the right json data for this entity based on the name
                const result = data.find(e => e.name === this.entity_name)

                // Initialize Rendering Component with entity data
                this.rendering_component.initComponent(result);

                // Initialize Physics Component with entity data
                this.physics_component.initComponent(result["character_info"] || {});
            })
            .catch(err => console.error("Error getting frame data:\n", err));
    }
    
    // This update function updates the instance's animation frame based
    // on the time passed since the last call
    update(deltaTime) {
        this.physics_component.update(this.transform_component.transform, deltaTime);
        this.rendering_component.update(this.physics_component);
    }
    
    // The FixedUpdate function run withing a fixed and constant interval, resulting in FPS-independent logic
    fixedUpdate(fixedDeltaTime){
    
        this.physics_component.fixedUpdate(this.transform_component.transform, fixedDeltaTime);
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
       this.rendering_component.render(this.transform_component.transform, this.physics_component, ctx);
    }
};