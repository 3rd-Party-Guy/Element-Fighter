import Vector2 from "../../Vector2.js";
import System from "./System.js"
import CanvasManager from "../CanvasManager.js"
import EntityManager from "../EntityManager.js";
import { AttackModes } from "../../StateMachine.js";
import { withinRange } from "../../Utilities.js";

export default class ColissionSystem extends System {
    involved_projectiles = [];
    involved_players = [];

    update(delta) {
        const players = EntityManager.getInstance(EntityManager).players;
        if (players.length < 2) return;

        const canvas_manager = CanvasManager.getInstance(CanvasManager);
        const col_image = canvas_manager.collisionImage;
        const data = col_image.image_data.data;
        const image_width = col_image.image_data.width;
        const start_pos = new Vector2(col_image.start_pos.x, col_image.start_pos.y);

        // INFO: Debug Purposes only. Shows the collision image with absolute coordinates
        // canvas_manager.gameplayContext.putImageData(col_image.image_data, start_pos.x, start_pos.y);

        for (let i = 0; i < data.length; i += 4) {
            const sumRGB = data[i] + data[i+1] + data[1+2];

            // // if pixel isn't white or black 
            if (sumRGB !== 0 && sumRGB !== 255) {
                // Calculate Collision Position (relative to cropped image)
                const x = Math.trunc(i / 4) % image_width;
                const y = Math.trunc(i / (image_width * 4));
                // Add Offset to the Relative Coordinates
                const col_pos_abs = new Vector2(x + start_pos.x, y + start_pos.y);

                this.#onCollision(delta, col_pos_abs);
                return;
            }
        }
    }

    #onCollision(delta, col_pos) {
        // INFO: Debug Purposes only. Logs the absolute collision position
        // console.log(`X: ${col_pos.x}; Y: ${col_pos.y}`);

        this.#getInvolvedEntities(col_pos);

        this.#handleMeleeAttacks();
        this.#handleProjectiles(delta);

        this.involved_projectiles = [];
        this.involved_players = [];
    }

    #getInvolvedEntities(col_pos) {
        for (const p of EntityManager.getInstance(EntityManager).projectiles) {
            const transform = p.transform;
            if (withinRange(col_pos.x, transform.position.x, transform.position.x + transform.width) &&
                withinRange(col_pos.y, transform.position.y, transform.position.y + transform.height)) {
                this.involved_projectiles.push(p);
            }
        }

        for (const p of EntityManager.getInstance(EntityManager).players) {
            const transform = p.transform;
            if (withinRange(col_pos.x, transform.position.x, transform.position.x + transform.width) &&
                withinRange(col_pos.y, transform.position.y, transform.position.y + transform.height)) {
                this.involved_players.push(p);
            }
        }
    }

    #handleMeleeAttacks() {
        if (this.involved_players.length < 2) return;

        const player_one = this.involved_players[0];
        const player_two = this.involved_players[1];
        
        if (player_one.attackState === player_two.attackState) return;

        let attacking_player = this.#calculateAttackingPlayer(player_one, player_two);

        for (const p of EntityManager.getInstance(EntityManager).players) {
            if (p === attacking_player) continue;

            attacking_player.onAttack(p);
        }
    }

    #handleProjectiles(delta) {
        if (this.involved_projectiles.length === 0) return;

        for (const p of this.involved_projectiles) {
            for (const e of this.involved_players) {
                if(p.owner === e) continue;
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
}