import System from "./System.js"
import CanvasManager from "../CanvasManager.js"

export default class ColissionSystem extends System {
    update(delta) {
        const canvas_manager = CanvasManager.getInstance(CanvasManager);
        const data = canvas_manager.collisionImage.data;

        for (let i = 0; i < data.length; i += 4) {
            const sumRGB = data[i] + data[i+1] + data[1+2];

            // // if pixel isn't white or black 
            if (sumRGB !== 0 && sumRGB !== 255) {
                console.log("COLLISION");
                return;
            }
        }
    }
}