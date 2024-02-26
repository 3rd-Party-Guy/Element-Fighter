/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    Keeps track of button presses, routes Commands every frame

import Singleton from "./Singleton.js";
import Command from "../Command.js"
import EntityManager from "./EntityManager.js";
import Entity from "../Entity.js";

export default class InputManager extends Singleton {
    // Lookup Table for input codes and Commands
    inputActionLookUp = undefined;
    
    activeInputLookup = undefined;

    constructor() {
        super();

        this.inputActionLookup = new Map();
        this.activeInputLookup = new Map();
    }

    // Set Input is called every time there is an input event.
    // This is used to keep track of all keys that are currently down.
    setInput(event) {
        const is_active = event.type == 'keydown';
        const command = this.inputActionLookup.get(event.code);

        this.activeInputLookup.set(event.code, is_active);

        if (is_active)
            command?.onSet();
        else
            command?.onUnset();
    }

    // Handle Input is called every frame. It iterates through all commands map to
    // a key code that is held down
    handleInput()
    {
        for (const [key, value] of this.activeInputLookup.entries())
            if (value === true)
                this.inputActionLookup.get(key)?.execute(EntityManager.getInstance(EntityManager).playerOne);
    }

    // Adds or changes an existing keyCode's Command
    addInputActionLookup = (keyCode, Command) =>
        this.inputActionLookup.set(keyCode, Command);
    
    isKeyActive = (keyCode) => {
        return this.activeInputLookup.get(keyCode) ? true : false;
    }
}