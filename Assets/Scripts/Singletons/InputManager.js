/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    Keeps track of button presses, routes Commands every frame

import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js";
import GamepadHandler from "../GamepadHandler.js";
import Entity from "../Entity.js";

export default class InputManager extends Singleton {
    // Lookup Table for input codes and Commands
    inputKeyboardActionLookup = undefined;
    activeKeyboardInputLookup = undefined;

    connected_gamepads = undefined;

    constructor() {
        super();

        this.inputKeyboardActionLookup = new Map();
        this.activeKeyboardInputLookup = new Map();

        this.connected_gamepads = [];
    }

    clear() {
        this.inputKeyboardActionLookup = new Map();
        this.activeKeyboardInputLookup = new Map();

        for (const gp of this.connected_gamepads)
            gp.player = undefined;
    }

    // Set Input is called every time there is an input event.
    // This is used to keep track of all keys that are currently down.
    setKeyboardInput(event) {
        event.preventDefault();
        const is_active = event.type == 'keydown';
        this.activeKeyboardInputLookup.set(event.code, is_active);
        
        const cmd = this.inputKeyboardActionLookup.get(event.code);
        (is_active) ? cmd?.onPressed() : cmd?.onReleased();
    }

    // Handle Input is called every frame. It iterates through all commands map to
    // a key code that is held down
    #handleKeyboardInput()
    {
        for (const [key, value] of this.activeKeyboardInputLookup.entries())
            if (value === true) {
                this.inputKeyboardActionLookup.get(key)?.execute();
            }
    }

    handleInput() {
        this.#handleKeyboardInput();
        this.#handleGamepadInput();
    }

    // Adds or changes an existing keyCode's Command
    addKeyboardInputActionLookup = (keyCode, command) =>
        this.inputKeyboardActionLookup.set(keyCode, command);
    
    isKeyActive(keyCode) {
        if (keyCode === "any") {
            for (const val of this.activeKeyboardInputLookup.values())
                if (val === true) return true;

            for (const gamepad of this.connected_gamepads)
                if (gamepad.anyButton) return true;

            return false;
        }

        this.activeKeyboardInputLookup.get(keyCode) ? true : false;
    }

    connectGamepad(index) {
        this.connected_gamepads.push(new GamepadHandler(index))
    }

    #handleGamepadInput() {
        for (const gp of this.connected_gamepads)
            gp.handleInput();
    }
}