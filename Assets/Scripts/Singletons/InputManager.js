/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    Keeps track of button presses, routes Commands every frame

import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js";
import { GamepadMoveHorizontalCommand, GamepadJumpCommand, GamepadDuckCommand } from "../CommandGamepad.js";
import PhysicsComponent from "../Components/PhysicsComponent.js";

export default class InputManager extends Singleton {
    // Lookup Table for input codes and Commands
    inputKeyboardActionLookup = undefined;
    activeKeyboardInputLookup = undefined;

    gamepad_horizontal_command = new GamepadMoveHorizontalCommand();
    gamepad_jump_command = new GamepadJumpCommand();
    gamepad_duck_command = new GamepadDuckCommand();
    gamepad_holding_jump = false;
    gamepad_holding_duck = false;

    constructor() {
        super();

        this.inputKeyboardActionLookup = new Map();
        this.activeKeyboardInputLookup = new Map();
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
    handleKeyboardInput()
    {
        for (const [key, value] of this.activeKeyboardInputLookup.entries())
            if (value === true)
                this.inputKeyboardActionLookup.get(key)?.execute(EntityManager.getInstance(EntityManager).playerTwo);
    }

    // Adds or changes an existing keyCode's Command
    addKeyboardInputActionLookup = (keyCode, command) =>
        this.inputKeyboardActionLookup.set(keyCode, command);
    
    isKeyActive = (keyCode) =>
        this.activeKeyboardInputLookup.get(keyCode) ? true : false;
    /// ----    KEYBOARD INPUT END      ----

    handleGamepadInput() {
        const gp1 = navigator.getGamepads()[0];
        const gp2 = navigator.getGamepads()[1];

        if (gp1) {
            const playerOne = EntityManager.getInstance(EntityManager).playerOne;
            this.#handleGamepadInputForPlayer(gp1, playerOne);
        }
        if (gp2) {
            const playerTwo = EntityManager.getInstance(EntityManager).playerTwo;
            this.#handleGamepadInputForPlayer(gp2, playerTwo);
        }

    }

    #handleGamepadInputForPlayer(gp, player) {
        this.gamepad_horizontal_command.execute(player, gp["axes"][0])
    
        this.#handleGamepadJump(gp, player);
        this.#handleGamepadDuck(gp, player);
    }

    #handleGamepadJump(gamepad, player) {
        if (gamepad["buttons"][3].pressed) {
            if (!this.gamepad_holding_jump) {
                this.gamepad_jump_command.execute(player);
                this.gamepad_holding_jump = true;
            }
        } else
            this.gamepad_holding_jump = false;
    }

    #handleGamepadDuck(gamepad, player) {
        if (!player.getComponentOfType(PhysicsComponent).is_grounded) return;

        if (gamepad["axes"][1] > 0.7 || gamepad["buttons"][2].pressed) {
            if (!this.gamepad_holding_duck) {
                this.gamepad_duck_command.execute(player);
                this.gamepad_holding_duck = true;
            }
        } else 
            this.gamepad_holding_duck = false;
    }
}