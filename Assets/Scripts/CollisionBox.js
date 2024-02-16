import Vector2 from "./Vector2.js";

export default class CollisionBox {
    ld = new Vector2(0, 0);
    ru = new Vector2(0, 0);

    is_active = false;

    constructor(left_down, right_up) {
        this.ld = left_down;
        this.ru = right_up;
    }

    getLD = () => this.ld;
    getRU = () => this.ru;

    getHeight = () => this.ru.getY() - this.ld.getY();
    getWidth = () => this.ru.getX() - this.ld.getX(); 

    setLD = (x, y) => this.ld.set(x, y);
    setRU = (x, y) => this.ru.set(x, y);

    collidesWith(other_box) {
        return (
            this.ld.getX() + this.getWidth() >= other_box.getLD().getX() &&
            other_box.getLD().getX() + other_box.getWidth() >= this.ld.getX() ||
            this.ld.getY() + this.getHeight() >= other_box.getLD().getY() &&
            other_box.getLD().getY() + other_box.getHeight() >= this.ld.getY()
        );
    }
}