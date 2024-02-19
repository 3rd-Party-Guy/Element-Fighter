import Singleton from "./Singleton.js";
import CollisionBox from "./CollisionBox.js";

export default class MapColliderManager extends Singleton {
    collision_boxes = [];

    addCollision = (left_down, right_up) =>
        this.collision_boxes.push(new CollisionBox(left_down, right_up));;

    renderBoxes(ctx) {
        for (const col_box of this.collision_boxes) {
            const x = col_box.ld.x;
            const y = col_box.ld.y;

            ctx.rect(x, y , col_box.width, col_box.height);
        }
    }

    getBoxes = () => this.collision_boxes;
}