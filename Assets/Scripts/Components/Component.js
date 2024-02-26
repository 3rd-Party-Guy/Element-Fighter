/// Author:         Leon Enders, Nikolay Hadzhiev
/// Description:    An abstract class for the Components in the Entity Component System followed by concrete classes of inerhiting from component afterwards. These are used to manage behaviour of entities, for different game domains.

// Base Class for Components, shared behaviour for all components will be implemented here
// implements behaviour for a specific domain to decouple from entity
// Create Child classes for each domains behaviour, to decouple most of the behaviour from entity (Currently: Transform Component, Physics Component, Rendering Component)

export default class Component {
    constructor()
    {
        if(this.constructor == Component)
        {
            throw new Error("Abstract classes can\'t be instantiated.");
        }
    }

    initComponent() {}
    fixedUpdate() {}
    update() {}
}




