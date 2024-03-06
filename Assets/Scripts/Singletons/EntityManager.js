// Author:          Nikolay Hadzhiev
// Description:     Holds and keeps track of all entities

import Singleton from "./Singleton.js";

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
        for(const e of this.projectiles)
        if(e===projectile_entity) this.projectiles.splice(projectile_entity);
    }

    get all() {
        return this.entities.concat(this.players);
    }

    updateEntities() {
        for (const pr of this.projectiles)
            pr.update();   

        for (const p of this.players)
            p.update();

        for (const e of this.entities)
            e.update()

    }

    fixedUpdateEntities() {
        for (const pr of this.projectiles)
        pr.fixedUpdate();  

        for (const p of this.players)
            p.fixedUpdate();
        
        for (const e of this.entities)
            e.fixedUpdate()
    }
}