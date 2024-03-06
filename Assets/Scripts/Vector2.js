export default class Vector2 {
    x = 0;
    y = 0;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // factory method to instantiate new vector with json data
    static fromJSON(data)
    {
        let x = data[0];
        let y = data[1];

        return new Vector2(x,y);
    }

    get x() { return this.x; }
    get y() { return this.y; }

    set x(x) { this.x = x; }
    set y(y) { this.y = y; }

    set (value) {
        this.x = value.x;
        this.y = value.y;
    }

    add (vec2){
        this.x += vec2.x;
        this.y += vec2.y;
    }

    scale(scalar){
       
        //TODO: Can this be solved without creating a new vector?
        return new Vector2(this.x * scalar, this.y * scalar);
    }
}