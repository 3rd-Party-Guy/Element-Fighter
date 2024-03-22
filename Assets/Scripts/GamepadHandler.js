// Author:          Nikolay Hadzhiev
// Description:     Instances of this class are responsible for reading input and executing the respective commands.

import { GamepadMoveHorizontalCommand } from "./CommandGamepad.js";
import { AttackLightCommand, AttackHeavyCommand, AbilityOneCommand, AbilityTwoCommand, JumpCommand, DuckCommand } from "./Command.js";

import EntityManager from "./Singletons/EntityManager.js";

// Every gamepad has its own gamepad handler
// All gamepad handlers are called by the input manager
export default class GamepadHandler {
    index = undefined;
    player = undefined;

    // INFO: Do this in Constructor
    gamepad_horizontal_command = undefined;
    gamepad_jump_command = undefined;
    gamepad_duck_command = undefined;

    attack_light_command = undefined;
    attack_heavy_command = undefined;
    ability_one_command = undefined;
    ability_two_command = undefined;

    is_holding_jump = false;
    is_holding_duck = false;

    constructor(controller_index) {
        this.index = controller_index;
        
        this.#initialize();
    }

    #initialize() {
        this.player = EntityManager.getInstance(EntityManager).players[this.index];

        if (this.player) {
            this.gamepad_horizontal_command = new GamepadMoveHorizontalCommand(this.player);
            this.gamepad_jump_command = new JumpCommand(this.player);
            this.gamepad_duck_command = new DuckCommand(this.player);
        
            this.attack_light_command = new AttackLightCommand(this.player);
            this.attack_heavy_command = new AttackHeavyCommand(this.player);
            this.ability_one_command = new AbilityOneCommand(this.player);
            this.ability_two_command = new AbilityTwoCommand(this.player);
        }
    }

    get gamepad() {
        return navigator.getGamepads()[this.index];
    }

    get jumpButton() {
        return this.gamepad["buttons"][3];
    }

    get duckButton() {
        return this.gamepad["buttons"][2];
    }

    get lightAttackButton() {
        return this.gamepad["buttons"][0];
    }

    get heavyAttackButton() {
        return this.gamepad["buttons"][1];
    }

    get abilityOneButton() {
        return this.gamepad["buttons"][4];
    }

    get abilityTwoButton() {
        return this.gamepad["buttons"][5];
    }

    get anyButton() {
        for (let button of this.gamepad.buttons)
            if (button.pressed) return true;

        return false;
    }

    handleInput() {
        if (!this.player)
            this.#initialize();
        else {
            this.#moveHorizontal();
            this.#handleJump();
            this.#handleDuck();
            this.#handleAttacks();
        }
    }

    #moveHorizontal() {
        this.gamepad_horizontal_command.execute(this.player, this.gamepad["axes"][0]);
    }

    #handleJump() {
        if (this.jumpButton.pressed) {
            this.gamepad_jump_command.onPressed();
            this.gamepad_jump_command.execute(this.player);
        } else if (this.gamepad_jump_command.pressed)
            this.gamepad_jump_command.onReleased();
    }

    #handleDuck() {
        // if (!this.player.getComponentOfType(PhysicsComponent).is_grounded) return;
        
        if (this.gamepad["axes"][1] > 0.7 || this.duckButton.pressed) {
            this.gamepad_duck_command.onPressed();
            this.gamepad_duck_command.execute(this.player);
        } else if (this.gamepad_duck_command.pressed)
            this.gamepad_duck_command.onReleased();
    }

    #handleAttacks() {
        if (this.lightAttackButton.pressed) {
            this.attack_light_command.onPressed();
            this.attack_light_command.execute(this.player);
            return;
        }
        else if (this.attack_light_command.pressed)
            this.attack_light_command.onReleased();
        
        if (this.heavyAttackButton.pressed) {
            this.attack_heavy_command.onPressed();
            this.attack_heavy_command.execute(this.player);
            return;
        } else if (this.attack_heavy_command.pressed)
            this.attack_heavy_command.onReleased();
        
        if (this.abilityOneButton.pressed) {
            this.ability_one_command.onPressed();
            this.ability_one_command.execute(this.player);
            return;
        } else if (this.ability_one_command.pressed)
            this.ability_one_command.onReleased();
        
        if (this.abilityTwoButton.pressed) {
            this.ability_two_command.onPressed();
            this.ability_two_command.execute(this.player);
            return;
        } else if (this.ability_two_command.pressed)
            this.ability_two_command.onReleased();
    }
}