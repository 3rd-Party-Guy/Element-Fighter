// Author: Nikolay Hadzhiev, Leon Enders
// Description: The Transform component is responsible for stashing and controlling an entity's position

import Component from "./Component.js";

export default class TransformComponent extends Component {
    transform = undefined;

    constructor(start_transform) {
        super();
        
        this.transform = start_transform;
    }
}