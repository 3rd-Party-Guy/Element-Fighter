// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     The Transform component is responsible for stashing and controlling an entity's position

import Component from "./Component.js";

export default class TransformComponent extends Component {
    position = undefined;
    width = 0;
    height = 0;

    constructor(start_pos, width, height) {
        super();
        
        this.position = start_pos;
        this.width = width;
        this.height = height;
    }
}