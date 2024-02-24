/// Author:         Leon Enders
/// Description:    An abstract class of a process which acts on all entities with an desired component

import Singleton from "../Singleton.js"
import Entity from "../Entity.js";
import PhysicsComponent from "../Components/PhysicsComponent.js";
import TransformComponent from "../Components/TransformComponent.js";

export default class PhysicsSystem extends Singleton {
        entities = [];
       
        addEntity = (entity) =>
            this.entities.push(entity);
        
        update(delta_Time)
        {   
            for (let entity of this.entities)
                entity.getComponentOfType(PhysicsComponent)?.update(entity.getComponentOfType(TransformComponent).transform, delta_Time);
        }

        fixedUpdate(fixed_delta_time)
        {
            for (let entity of this.entities)
                entity.getComponentOfType(PhysicsComponent)?.fixedUpdate(entity.getComponentOfType(TransformComponent).transform, fixed_delta_time);
        }
}