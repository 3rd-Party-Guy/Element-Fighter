// Author:          Nikolay Hadzhiev
// Description:     Holds and keeps track of all entities

import Singleton from "./Singleton.js";

export default class EntityManager extends Singleton {
    entities = [];

    // Add a new entity to the entity manager
    addEntity(entity) {
        // Prevents adding an entity that is already listed
        for (const e of this.entities)
            if (e === entity) return;

        this.entities.push(entity);
    } 

    get entities() {
        return this.entities;
    }

    get playerOne() {
        return this.entities[0];
    }
}