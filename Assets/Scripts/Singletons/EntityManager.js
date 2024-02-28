// Author:          Nikolay Hadzhiev
// Description:     Holds and keeps track of all entities

import Singleton from "./Singleton.js";

export default class EntityManager extends Singleton {
    entities = [];
    players = [];

    // Add a new entity to the entity manager
    addEntity(entity) {
        // Prevents adding an entity that is already listed
        for (const e of this.entities)
            if (e === entity) return;

        this.entities.push(entity);
    }

    addPlayer(player_entity) {
        for (const e of this.players)
            if (e === player_entity) return;

        this.players.push(player_entity);
        this.entities.push(player_entity);
    }
}