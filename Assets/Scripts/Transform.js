import Vector2 from "./Vector2.js";
export default class Transform{

    position = new Vector2(0,0);
    rotation = new Vector2(0,0);
    scale = new Vector2(0,0);

    constructor(position)
    {
        
        this.position = position;
    }


    get position() { return this.position; }
    get rotation() { return this.rotation; }
    get scale() { return this.scale; }

    set position(position) { this.position = position; }
    set rotation(rotation) { this.rotation = rotation; }
    set scale(scale) { this.scale = scale; }

    set (transform) {
        this.position = transform.position;
        this.rotation = transform.rotation;
        this.scale = transform.scale;
    }

   

    

    

}