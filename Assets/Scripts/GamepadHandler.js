// Author:          Nikolay Hadzhiev
// Description:     Instances of this class are responsible for reading input and executing the respective commands.

import { GamepadMoveHorizontalCommand } from "./CommandGamepad.js";
import { AttackLightCommand, AttackHeavyCommand, AbilityOneCommand, AbilityTwoCommand, JumpCommand, DuckCommand } from "./Command.js";
import InputManager from "./Singletons/InputManager.js";
import EntityManager from "./Singletons/EntityManager.js";

// Every gamepad has its own gamepad handler
// All gamepad handlers are called by the input manager
export default class GamepadHandler {
    index = undefined;
    player = undefined;
    // INFO: Do this in Constructor
    

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
        if(!this.player){
            this.player = EntityManager.getInstance(EntityManager).players[this.index];
            return;
        } 
        this.#moveHorizontal();
        this.#handleJump();
        this.#handleDuck();
        this.#handleAttacks();
    }

    #moveHorizontal() {
        new GamepadMoveHorizontalCommand().execute(this.player,this.gamepad["axes"][0]);
    }

    #handleJump() {
        let gamepad_jump_command = new JumpCommand(this.player);
        if (this.jumpButton.pressed) {

            gamepad_jump_command.onPressed();
            gamepad_jump_command.execute(this.player);
        } else if (gamepad_jump_command.pressed)
            gamepad_jump_command.onReleased();
    }

    #handleDuck() {
        // if (!this.player.getComponentOfType(PhysicsComponent).is_grounded) return;
        let gamepad_duck_command = new DuckCommand(this.player);
        if (this.gamepad["axes"][1] > 0.7 || this.duckButton.pressed) {
            gamepad_duck_command.onPressed();
            gamepad_duck_command.execute(this.player);
        } else if (gamepad_duck_command.pressed)
            gamepad_duck_command.onReleased();
    }

    #handleAttacks() {
        let attack_light_command =  new AttackLightCommand(this.player);
        let attack_heavy_command= new AttackHeavyCommand(this.player);
        let ability_one_command =new AbilityOneCommand(this.player);
        let ability_two_command =new AbilityTwoCommand(this.player);

        if (this.lightAttackButton.pressed) {
            attack_light_command.onPressed();
            attack_light_command.execute(this.player);
            return;
        }
        else if (attack_light_command.pressed)
            attack_light_command.onReleased();
        
        if (this.heavyAttackButton.pressed) {
            attack_heavy_command.onPressed();
            attack_heavy_command.execute(this.player);
            return;
        } else if (attack_heavy_command.pressed)
            attack_heavy_command.onReleased();
        
        if (this.abilityOneButton.pressed) {
            ability_one_command.onPressed();
            ability_one_command.execute(this.player);
            return;
        } else if (ability_one_command.pressed)
            ability_one_command.onReleased();
        
        if (this.abilityTwoButton.pressed) {
            ability_two_command.onPressed();
            ability_two_command.execute(this.player);
            return;
        } else if (ability_two_command.pressed)
            ability_two_command.onReleased();
    }
}