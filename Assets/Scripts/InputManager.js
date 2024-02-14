/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    This is the InputManager Singleton
import MoveCommand from "./Command.js"

export default class InputManager{
    // Player, needed for Commands
    player = undefined;

    // Lookup Table for input codes and Commands
    inputActionLookUp = new Map();
    
    constructor(in_player )
    {
        this.player = in_player;
    }

    // Handle Input is called every time there is an input event. This function checks if there is a defined command for
    // the keyCode, and executes if found
    handleInput(keyCode)
    {
        console.log("event keycode: " + keyCode);
        this.inputActionLookUp.get(keyCode)?.execute(this.player);
        
    }

    // Adds or changes an existing keyCode's Command
    addInputActionLookUp(keyCode, Command)
    {
        this.inputActionLookUp.set(keyCode, Command);
    }

}