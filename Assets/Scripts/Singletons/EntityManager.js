// Author:          Nikolay Hadzhiev
// Description:     Holds and keeps track of all entities

import Singleton from "./Singleton.js";

// The entity manager divides and keeps track of different types of entities
export default class EntityManager extends Singleton {
    entities = [];
    players = [];
    projectiles = [];

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
    }

    addProjectile(projectile_entity)
    {
        for (const e of this.projectiles)
        if(e===projectile_entity) return;

        this.projectiles.push(projectile_entity);
    }

    removeProjectile(projectile_entity)
    {
        for (let i = 0; i < this.projectiles.length; i++) {
            if (this.projectiles[i] === projectile_entity) {
                this.projectiles.splice(i, 1);
                return;
            }
        }
    }

    clear() {
        this.entities = [];
        this.players = [];
        this.projectiles = [];
    }

    get all() {
        return this.entities.concat(this.players).concat(this.projectiles);
    }

    get combatEntities() {
        return this.players.concat(this.projectiles);
    }

    updateEntities(delta) {
        for (const e of this.all)
            e.update(delta);   
    }

    fixedUpdateEntities(fixed_delta) {
        for (const e of this.all)
            e.fixedUpdate(fixed_delta);
    }
}