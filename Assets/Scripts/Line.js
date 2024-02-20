import Vector2 from "./Vector2.js";

export default class Line {
    ld;
    ru;
    
    constructor(ld, ru) {
        this.ld = ld;
        this.ru = ru;
    }

    set ld(ld) { this.ld = ld }
    set ru(ru) { this.ru = ru }

    get ld() { return this.ld; }
    get ru() { return this.ru; }
}