import Vector2 from "./Vector2.js";

export default class Transform{
    position = new Vector2(0,0);

    constructor(position)
    {
        
        this.position = position;
    }

    get position() { return this.position; }

    set position(position) { this.position = position; }

    set (transform) {
        this.position = transform.position;
    }
}