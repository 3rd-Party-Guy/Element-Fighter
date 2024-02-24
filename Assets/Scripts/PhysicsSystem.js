/// Author:         Leon Enders
/// Description:    An abstract class of a process which acts on all entities with an desired component

import Singleton from "./Singleton.js"

export default class PhysicsSystem extends Singleton{
        entities = [];
       
        addEntities(entity)
        {
            this.entities.push(entity);
        }
        
        update(delta_Time)
        {   
            for (let entity of this.entities)
            {
                if(entity.hasOwnProperty('physics_component') && entity.hasOwnProperty('transform_component'))
                {
                    entity.physics_component.update(entity.transform_component.transform, delta_Time);
                }
            }
        }

        fixedUpdate(fixed_delta_time)
        {
            for (let entity of this.entities)
            {
                if(entity.hasOwnProperty('physics_component') && entity.hasOwnProperty('transform_component'))
                {
                    entity.physics_component.fixedUpdate(entity.transform_component.transform, fixed_delta_time);
                }
            }
        }
}