import Vector2 from "./Vector2.js";

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

    collidesWithLine(line) {
        const boxLDX = this.ld.x;
        const boxLDY = this.ld.y;
        const boxRUX = this.ru.x;
        const boxRUY = this.ru.y;

        const lineLDX = line.ld.x;
        const lineLDY = line.ld.y;
        const lineRUX = line.ru.x;
        const lineRUY = line.ru.y;

        if ((boxLDX <= lineLDX && lineRUX <= boxRUX &&
            boxLDY <= lineLDY && lineRUY >= boxRUY) ||
            (boxLDX <= lineRUX && lineRUX <= boxRUX &&
            boxLDY <= lineRUY && lineRUY >= boxRUY))
            return true;
        
        if ((lineLDX <= boxRUX && lineRUX >= boxLDX &&
            lineRUY >= boxRUY && lineLDY <= boxLDY) ||
            (lineLDY <= boxRUY && lineRUY >= boxLDY &&
            lineRUX >= boxLDX && lineLDX <= boxRUX) ||
            (lineLDX <= boxRUX && lineRUX >= boxLDX) &&
            lineRUY <= boxRUY && lineLDY >= boxLDY)
            return true;
        
        return false;
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