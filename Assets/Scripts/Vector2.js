export default class Vector2 {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX = () => this.x;
    getY = () => this.y;

    setX = (x) => this.x = x;
    setY = (y) => this.y = y;

    set = (x, y) => {
        this.x = x;
        this.y = y;
    }
}