/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    This is the InputManager Singleton
import MoveCommand from "./Command.js"

export  class InputMappingContext
{
    walkLeft = 0;
    walkRight = 0;
    jump = 0;
    duck = 0;
    attack1 = 0;
    attack2 = 0;
    ability1 = 0;
    ability2 = 0;

    constructor(leftKey,rightKey,jumpKey, duckKey, attack1Key, attack2Key, ability1Key,ability2Key)
    {
        this.walkLeft = leftKey;
        this.walkRight = rightKey;
        this.jump = jumpKey;
        this.duck = duckKey;
        this.attack1 = attack1Key;
        this.attack2 = attack2Key;
        this.ability1 = ability1Key;
        this.ability2 = ability2Key;
    }
}



export default class InputManager{
    // Instance Properties: ------------------------------------------------
    // Player variable
    player = undefined;
    
    //Input Mapping Context , mapping InputAction to InputKey
    inputMappingContext = undefined;

    // Mapping InputKeyCode to Command
    inputActionLookUp = new Map();

   
    
    

    
    // Constructor: ---------------------------------------------------------
    constructor(in_player, in_inputMappingContext )
    {
        this.player = in_player;
        this.inputMappingContext = in_inputMappingContext;
        this.inputActionLookUp.set(this.inputMappingContext.walkLeft, new MoveCommand(-1,0));
        this.inputActionLookUp.set(this.inputMappingContext.walkRight, new MoveCommand(1,0));
    }

    handleInput(keyCode)
    {
        console.log("event keycode: " + keyCode);
        if(this.inputActionLookUp.get(keyCode) != null)
        {
            this.inputActionLookUp.get(keyCode).execute(this.player);
        }
        
    }

}