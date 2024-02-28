/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    Keeps track of button presses, routes Commands every frame

import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js";
import GamepadHandler from "../GamepadHandler.js";
// import { GamepadMoveHorizontalCommand, GamepadJumpCommand, GamepadDuckCommand } from "../CommandGamepad.js";
// import PhysicsComponent from "../Components/PhysicsComponent.js";

export default class InputManager extends Singleton {
    // Lookup Table for input codes and Commands
    inputKeyboardActionLookup = undefined;
    activeKeyboardInputLookup = undefined;

    connected_gamepads_amount = undefined;
    connected_gamepads = undefined;

    constructor() {
        super();

        this.inputKeyboardActionLookup = new Map();
        this.activeKeyboardInputLookup = new Map();

        this.connected_gamepads_amount = 0;
        this.connected_gamepads = [];
    }

    /// ----    KEYBOARD INPUT BEGIN    ----
    // Set Input is called every time there is an input event.
    // This is used to keep track of all keys that are currently down.
    setKeyboardInput(event) {
        const is_active = event.type == 'keydown';
        const command = this.inputKeyboardActionLookup.get(event.code);

        this.activeKeyboardInputLookup.set(event.code, is_active);
        
        (is_active) ? command?.onSet() : command?.onUnset();
    }

    // Handle Input is called every frame. It iterates through all commands map to
    // a key code that is held down
    #handleKeyboardInput()
    {
        for (const [key, value] of this.activeKeyboardInputLookup.entries())
            if (value === true)
                this.inputKeyboardActionLookup.get(key)?.execute(EntityManager.getInstance(EntityManager).playerTwo);
    }

    handleInput() {
        this.#handleKeyboardInput();
        this.#handleGamepadInput();
    }

    // Adds or changes an existing keyCode's Command
    addKeyboardInputActionLookup = (keyCode, command) =>
        this.inputKeyboardActionLookup.set(keyCode, command);
    
    isKeyActive = (keyCode) =>
        this.activeKeyboardInputLookup.get(keyCode) ? true : false;
    /// ----    KEYBOARD INPUT END      ----

    connectGamepad(index) {
        if (this.connected_gamepads_amount == 0)
            this.connected_gamepads.push(new GamepadHandler(index))
    }

    #handleGamepadInput() {
        for (const gp of this.connected_gamepads)
            gp.handleInput();
    }

    isPlayerHoldingJump(player) {
        const gp = this.connected_gamepads.find(e => e.player === player);

        if (!gp) return false;
        return gp.is_holding_jump;
    }

    isPlayerHoldingDuck(player) {
        const gp = this.connected_gamepads.find(e => e.player === player);

        if (!gp) return false;
        return gp.is_holding_duck;
    }
}