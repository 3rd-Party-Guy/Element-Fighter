import System from "./System.js"
import CanvasManager from "../CanvasManager.js"
import EntityManager from "../EntityManager.js";
import { AttackModes } from "../../StateMachine.js";

export default class ColissionSystem extends System {
    update(delta) {
        const canvas_manager = CanvasManager.getInstance(CanvasManager);
        const data = canvas_manager.collisionImage.data;

        for (let i = 0; i < data.length; i += 4) {
            const sumRGB = data[i] + data[i+1] + data[1+2];

            // // if pixel isn't white or black 
            if (sumRGB !== 0 && sumRGB !== 255) {
                this.#onCollision();
                return;
            }
        }
    }

    #onCollision() {
        this.#handleMeleeAttacks();
        this.#handleProjectiles();  
    }

    #handleMeleeAttacks() {
        const player_one = EntityManager.getInstance(EntityManager).players[0];
        const player_two = EntityManager.getInstance(EntityManager).players[1];
        
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

    #handleProjectiles() {
        if (EntityManager.getInstance(EntityManager).projectiles.length === 0) return;
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
}