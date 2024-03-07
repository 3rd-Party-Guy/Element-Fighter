// Author:          Nikolay Hadzhiev
// Description:     Keeps track of all canvases, provides the needed canvas

import Vector2 from "../Vector2.js"
import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js"
import TransformComponent from "../Components/TransformComponent.js"

export default class CanvasManager extends Singleton {
    gameplay_canvas = document.getElementById('game-window');
    collision_canvas = document.getElementById('collision-window');

    get gameplayContext() { return this.gameplay_canvas.getContext('2d'); }
    get collisionContext() { return this.collision_canvas.getContext('2d', { willReadFrequently: true }); }
    
    get width() { return this.gameplay_canvas.width; }
    get height() { return this.gameplay_canvas.height; }

    get clientWidth() { return this.gameplay_canvas.clientWidth; }
    get clientHeight() { return this.gameplay_canvas.clientHeight; }

    get collisionImage() {
        let x_start = 1280;
        let y_start = 720;
        let x_end = 0;
        let y_end = 0;

        for (const e of EntityManager.getInstance(EntityManager).combatEntities) {
            const t_comp = e.getComponentOfType(TransformComponent);
            const start_pos = t_comp.transform.position;
            const end_pos = new Vector2(start_pos.x + t_comp.width, start_pos.y + t_comp.height);

            if (start_pos.x < x_start) x_start = start_pos.x;
            if (start_pos.y < y_start) y_start = start_pos.y;
            if (end_pos.x > x_end) x_end = end_pos.x;
            if (end_pos.y > y_end) y_end = end_pos.y;            
        }

        return this.collisionContext.getImageData(
            x_start,
            y_start,
            x_end - x_start,
            y_end - y_start
        );
    }

    // INFO: Debug Only
    get clientRect() { return this.gameplay_canvas.getBoundingClientRect(); }

    clearCanvases() {
        this.gameplayContext.clearRect(
            0,
            0,
            this.gameplay_canvas.clientWidth,
            this.gameplay_canvas.clientHeight
        );

        this.collisionContext.clearRect(
            0,
            0,
            this.collision_canvas.clientWidth,
            this.collision_canvas.clientHeight
        );

        this.collisionContext.fillRect(
            0,
            0,
            this.collision_canvas.clientWidth,
            this.collision_canvas.clientHeight
        );
    }
}