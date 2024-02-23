// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     Base Entity class

import Vector2 from "./Vector2.js";
import MovementState from "./StateMachine.js";
import { MovementModes } from "./StateMachine.js";
import Transform from "./Transform.js";
import { TransformComponent } from "./Component.js";
import { PhysicsComponent } from "./PhysicsComponent.js";
import { RenderingComponent} from "./RenderingComponent.js";




class AnimationDataContext{
    image = undefined;
    image_source_normal = undefined;
    image_source_flipped = undefined;
    frame_data = undefined;

    constructor(image_source_path, frame_data)
    {
        this.image = new Image();
        this.image_source_normal = image_source_path + ".png";
        this.image_source_flipped = image_source_path + "_flipped.png";
        this.frame_data = frame_data;
    }
};

export default class Entity {
    entity_name = "Knight";

    frame_index = 0;
    last_update = Date.now();
    update_speed = 180;


    //MovementState variable
    movementState = new MovementState();

    //Mapping Animation Data to State
    AnimationDataForState = new Map();

    stateAnimation = undefined;
    stateFrameData = undefined;

    transform_component = new TransformComponent();
    physics_component = new PhysicsComponent();
    rendering_component = new RenderingComponent();

    // This contructor constructs the class instance!
    constructor(startX, startY, name) {
        this.entity_name = name;

        this.transform_component.initComponent(new Transform(new Vector2(startX, startY)));
        this.#setSpritesheetData();
    }

    #setSpritesheetData() {
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
    
    fixedUpdate(fixedDeltaTime){
    
        this.physics_component.fixedUpdate(this.transform_component.transform, fixedDeltaTime);
    }

    // This render function renders the instance's current animation frame
    // at the instance's xy-coordinates
    render(ctx) {
       this.rendering_component.render(this.transform_component.transform, this.physics_component, ctx);
    }
};