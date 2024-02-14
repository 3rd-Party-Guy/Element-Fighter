/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    This is the InputManager Singleton
import MoveCommand from "./Command.js"




export default class InputManager{
    // Instance Properties: ------------------------------------------------
    // Player variable
    player = undefined;

    // Mapping InputKeyCode to Command
    inputActionLookUp = new Map();

    
    // Constructor: ---------------------------------------------------------
    constructor(in_player )
    {
        this.player = in_player;
    }

    handleInput(keyCode)
    {
        console.log("event keycode: " + keyCode);
        let inputKeyLookUp = this.inputActionLookUp.get(keyCode);
        if(inputKeyLookUp != null)
        {
            inputKeyLookUp.execute(this.player);
        }
        
    }

    addInputActionLookUp(keyCode, Command)
    {
        this.inputActionLookUp.set(keyCode, Command);
    }

}