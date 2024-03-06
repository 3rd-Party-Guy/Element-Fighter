// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     The Transform component is responsible for stashing and controlling an entity's position

import Component from "./Component.js";

export default class TransformComponent extends Component {
    transform = undefined;
    width = 0;
    height = 0;

    constructor(start_transform, width, height) {
        super();
        
        this.transform = start_transform;
        this.width = width;
        this.height = height;
    }
}