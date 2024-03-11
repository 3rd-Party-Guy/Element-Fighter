// Author:          Nikolay Hadzhiev
// Description:     Instances of this class are responsible for reading input and executing the respective commands.

import GamepadCommand, { GamepadMoveHorizontalCommand, GamepadDuckCommand, GamepadJumpCommand } from "./CommandGamepad.js";
import Command, { AttackLightCommand, AttackHeavyCommand, AbilityOneCommand, AbilityTwoCommand } from "./Command.js";

import EntityManager from "./Singletons/EntityManager.js";

export default class GamepadHandler {
    index = undefined;
    player = undefined;

    // INFO: Do this in Constructor
    gamepad_horizontal_command = new GamepadMoveHorizontalCommand();
    gamepad_jump_command = new GamepadJumpCommand();
    gamepad_duck_command = new GamepadDuckCommand();

    attack_light_command = new AttackLightCommand();
    attack_heavy_command = new AttackHeavyCommand();
    ability_one_command = new AbilityOneCommand();
    ability_two_command = new AbilityTwoCommand();

    is_holding_jump = false;
    is_holding_duck = false;

    constructor(controller_index) {
        this.index = controller_index;
        this.player = EntityManager.getInstance(EntityManager).players[this.index];
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

    handleInput() {
        this.#moveHorizontal();
        this.#handleJump();
        this.#handleDuck();
        this.#handleAttacks();
    }

    #moveHorizontal() {
        this.gamepad_horizontal_command.execute(this.player, this.gamepad["axes"][0]);
    }

    #handleJump() {
        if (this.jumpButton.pressed) {
            if (!this.is_holding_jump) {
                this.gamepad_jump_command.execute(this.player);
                this.is_holding_jump = true;
            }
        } else
            this.is_holding_jump = false;
    }

    #handleDuck() {
        // if (!this.player.getComponentOfType(PhysicsComponent).is_grounded) return;
        
        if (this.gamepad["axes"][1] > 0.7 || this.duckButton.pressed) {
            if (!this.is_holding_duck) {
                this.gamepad_duck_command.execute(this.player);
                this.is_holding_duck = true;
            }
        } else
            this.is_holding_duck = false;
    }

    #handleAttacks() {
        if (this.lightAttackButton.pressed) {
            this.attack_light_command.execute(this.player);
            return;
        }
        else this.attack_light_command.onReleased();
        if (this.heavyAttackButton.pressed) {
            this.attack_heavy_command.execute(this.player);
            return;
        } else this.attack_heavy_command.onReleased();
        if (this.abilityOneButton.pressed) {
            this.ability_one_command.execute(this.player);
            return;
        } else this.ability_one_command.onReleased();
        if (this.abilityTwoButton.pressed) {
            this.ability_two_command.execute(this.player);
            return;
        } else this.ability_two_command.onReleased();
    }
}