import System from "./System.js"
import CanvasManager from "../CanvasManager.js"
import EntityManager from "../EntityManager.js";
import { AttackModes } from "../../StateMachine.js";

export default class ColissionSystem extends System {
    update(delta) {
        const players = EntityManager.getInstance(EntityManager).players;
        if (players.length < 2) return;

        const canvas_manager = CanvasManager.getInstance(CanvasManager);
        const data = canvas_manager.collisionImage.data;

        for (let i = 0; i < data.length; i += 4) {
            const sumRGB = data[i] + data[i+1] + data[1+2];

            // // if pixel isn't white or black 
            if (sumRGB !== 0 && sumRGB !== 255) {
                this.#onCollision(players, delta);
                return;
            }
        }
    }

    #onCollision(players, delta) {
        this.#handleMeleeAttacks(players);
        this.#handleProjectiles(players, delta);  
    }

    #handleMeleeAttacks(players) {
        const player_one = players[0];
        const player_two = players[1];
        
        if (!player_one || !player_two) return;
        if (player_one.attackState === player_two.attackState) return;

        let attacking_player = this.#calculateAttackingPlayer(player_one, player_two);
        if (attacking_player.is_attack_registered) return;

        for (const p of EntityManager.getInstance(EntityManager).players) {
            if (p !== attacking_player) {
                p.health -= attacking_player.damage;
                attacking_player.is_attack_registered = true;
            }
        }
    }

    #handleProjectiles(players, delta) {
        const projectiles = EntityManager.getInstance(EntityManager).projectiles;
        if (projectiles.length === 0) return;

        for (const p of projectiles) {
            for (const e of players) {
                if(p.owner === e) continue;
                if (!this.#checkPlayerProjectileCollision(e, p)) return;

                p.onCollision(e, delta);
            }
        }
    }

    #calculateAttackingPlayer(player_one, player_two) {
        if (player_one.attackState === AttackModes.AttackHeavy)
            return player_one;
        else if (player_two.attackState === AttackModes.AttackHeavy)
            return player_two;

        if (player_one.attackState === AttackModes.AttackLight)
            return player_one;

        return player_two;
    }

    #checkPlayerProjectileCollision(player, projectile) {
        const pos1 = player.transform.position;
        const pos2 = projectile.transform.position;
        
        const x1 = pos1.x;
        const x2 = pos2.x;

        const y1 = pos1.y;
        const y2 = pos2.y;

        const width1 = player.transform.width;
        const width2 = projectile.transform.width;
        
        const height1 = player.transform.height;
        const height2 = projectile.transform.height;

        const x1Bound = x1 + width1;
        const x2Bound = x2 + width2;

        const y1Bound = y1 + height1;
        const y2Bound = y2 + height2;

        const intersectX = (x1 <= x2Bound && x1Bound >= x2);
        const intersectY = (y1 <= y2Bound && y1Bound >= y2);

        return (intersectX && intersectY);
    }
}