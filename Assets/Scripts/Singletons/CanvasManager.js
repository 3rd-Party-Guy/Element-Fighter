// Author:          Nikolay Hadzhiev
// Description:     Keeps track of all canvases, provides the needed canvas

import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js"

export default class CanvasManager extends Singleton {
    gameplay_canvas = document.getElementById('game-window');
    collision_canvas = document.getElementById('collision-window');

    get gameplayContext() { return this.gameplay_canvas.getContext('2d'); }
    get collisionContext() { return this.collision_canvas.getContext('2d'); }
    
    get width() { return this.gameplay_canvas.width; }
    get height() { return this.gameplay_canvas.height; }

    get clientWidth() { return this.gameplay_canvas.clientWidth; }
    get clientHeight() { return this.gameplay_canvas.clientHeight; }

    // TODO: OPTIMIZE by only getting only characters snippet
    get collisionImage() {
        let x_start = 0;
        let y_start = 0;
        let x_end = 0;
        let y_end = 0;

        for (const e of EntityManager.getInstance(EntityManager).combatEntities) {
            
        }
        
        return this.collisionContext.getImageData(
            0,
            0,
            this.width,
            this.height
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