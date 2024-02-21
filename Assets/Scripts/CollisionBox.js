import Vector2 from "./Vector2.js";
import { withinRange } from "./Math.js";

export default class CollisionBox {
    ld = new Vector2(0, 0);
    ru = new Vector2(0, 0);

    is_active = false;

    constructor(left_down, right_up) {
        this.ld = left_down;
        this.ru = right_up;
    }

    get ld() { return this.ld; } 
    get ru() { return this.ru; }

    get height() { return this.ru.y - this.ld.y; }
    get width()  { return this.ru.x - this.ld.x; }

    get center() {
        return new Vector2(this.ld.x + this.width / 2, this.ld.y + this.height / 2)
    }

    set ld(ld) { this.ld = ld; }
    set ru(ru) { this.ru = ru; }


    collidesWithBox(other_box) {
        const x1 = this.ld.x;
        const x2 = other_box.ld.x;

        const y1 = this.ld.y;
        const y2 = other_box.ld.y;

        const width1 = this.width;
        const width2 = other_box.width;

        const height1 = this.height;
        const height2 = other_box.height;

        return (
            x1 < x2 + width2    &&
            x1 + width1 > x2    &&
            y1 < y2 + height2   &&
            y1 + height1 > y2
        );
    }

    collidesWithGroundcast(groundcast) {
        const lowest_groundcast_point = Math.max(groundcast.p2.y, groundcast.p1.y);
        const highest_groundcast_point = Math.min(groundcast.p2.y, groundcast.p1.y);

        if (!(lowest_groundcast_point - this.ru.y > 0 || lowest_groundcast_point - this.ru.y > 0))
            return false;
        if (!withinRange(groundcast.p1.x, this.ld.x, this.ru.x))
            return false;

        return true;
    }

    collidesWithPoint(pos) {
        return (
            pos.x >= this.ld.x &&
            pos.x <= this.ru.x &&
            pos.y >= this.ru.y &&
            pos.y <= this.ld.y
        );
    }
}