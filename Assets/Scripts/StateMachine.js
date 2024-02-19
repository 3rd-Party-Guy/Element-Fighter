export const MovementModes = Object.freeze({
    Idle: 'idle',
    Running: 'running',
})



export default class MovementState{

    #currentState = MovementModes.Idle;

    constructor(){
       
    }


   

    nextState(newMovementMode)
    {
        switch (this.#currentState) {
            case MovementModes.Idle:
                    
                    this.#currentState = newMovementMode;
                    
                break;
            case MovementModes.Running:
                    
                    this.#currentState = newMovementMode;
                    
                break;
            default:
                break;
        }
        
    }

    
}


