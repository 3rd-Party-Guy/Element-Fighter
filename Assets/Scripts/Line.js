// A line is defined by two Vector2s, p1 and p2
export default class Line {
    p1;
    p2;
    
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    set p1(p1) { this.p1 = p1 }
    set p2(p2) { this.p2 = p2 }

    get p1() { return this.p1; }
    get p2() { return this.p2; }
}