import Singleton from "../Singleton.js";

export default class CanvasManager extends Singleton {
    gameplay_canvas = document.getElementById('game-window');

    get gameplayContext() { return this.gameplay_canvas.getContext('2d'); }

    // INFO: Debug Only
    get clientRect() { return this.gameplay_canvas.getBoundingClientRect(); }

    clearGameplayCanvas() {
        this.gameplayContext.clearRect(
            0,
            0,
            this.gameplay_canvas.clientWidth,
            this.gameplay_canvas.clientHeight
        );
    }
}