// Author:          Nikolay Hadzhiev
// Description:     Keeps track of collision boxes for the map

import Singleton from "../Singleton.js";
import CollisionBox from "../CollisionBox.js";

export default class MapColliderManager extends Singleton {
    collision_boxes = [];

    addCollision = (left_down, right_up, is_platform) =>
        this.collision_boxes.push(new CollisionBox(left_down, right_up, is_platform));

    addBoxRenders(ctx) {
        for (const col_box of this.collision_boxes) {
            const x = col_box.ld.x;
            const y = col_box.ld.y;

            ctx.rect(x, y , col_box.width, col_box.height);
        }
    }

    addBoxCenterRenders(ctx, size) {
        for (const col_box of this.collision_boxes) {
            const x = col_box.center.x;
            const y = col_box.center.y;

            ctx.rect(x - center, y - center, center, center);
        }
    }

    getBoxes = () => this.collision_boxes;
}