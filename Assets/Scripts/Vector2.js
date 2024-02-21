export default class Vector2 {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() { return this.x; }
    get y() { return this.y; }

    set x(x) { this.x = x; }
    set y(y) { this.y = y; }

    set (value) {
        this.x = value.x;
        this.y = value.y;
    }
}