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

        let attacking_player = player_one;

        if (!player_one || !player_two) return;
        if (player_one.attackState === AttackModes.None && player_two.attackState === AttackModes.None) return;

        for (const p of EntityManager.getInstance(EntityManager).players) {
            if (p !== attacking_player) {
                p.health -= attacking_player.damage;
            }
        }

        // if (playerOne.isAttacking) {
        //     if (!playerTwo.isAttacking) {
        //         attackingPlayer = playerOne;
        //     } else {
        //         if (playerOne.attackingData.attacking_heavy && !playerTwo.attackingData.attacking_heavy)
        //             attackingPlayer = playerOne;
        //     }
        // }
    }

    #handleProjectiles() {
        if (EntityManager.getInstance(EntityManager).projectiles.length === 0) return;

    }
}