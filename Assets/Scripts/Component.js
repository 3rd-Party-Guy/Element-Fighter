/// Author:         Leon Enders
/// Description:    An abstract class for the Components in the Entity Component System followed by concrete classes of inerhiting from component afterwards. These are used to manage behaviour of entities, for different game domains.

import Transform from "./Transform";


// Base Class for Components, shared behaviour for all components will be implemented here
// implements behaviour for a specific domain to decouple from entity
// Create Child classes for each domains behaviour, to decouple most of the behaviour from entity (Currently: Transform Component, Physics Component, Rendering Component)



export class Component {

    owner = undefined;

    constructor()
    {
        if(this.constructor == Component)
        {
            throw new Error("Abstract classes can\'t be instantiated.");
        }
    }

    update()
    {
        throw new Error("Method \'update()\' must be implemented");
    }

}



class TransformComponent extends Component {

    #transform = new Transform();

    constructor(owner, transform)
    {
        this.owner = owner;
        this.position = transform.position;
        this.rotation = transform.rotation;
        this.scale = transform.scale;
    }

    update(transform)
    {
        this.#transform.add(transform);
    }

}


