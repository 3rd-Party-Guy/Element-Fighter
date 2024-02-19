export const MovementModes = Object.freeze({
    Idle: 'idle',
    Running: 'running',
    Jumping: 'jumping',
})



export default class MovementState{

   
    currentState = MovementModes.Idle;

    constructor(){
        
    }



    nextState(xVel, grounded)
    {
        switch (this.currentState) {
            case MovementModes.Idle:
                if(xVel !=0 && grounded)
                {
                    this.currentState = MovementModes.Running;
                    return true;
                    
                }
                if(!grounded)
                {
                    this.currentState = MovementModes.Jumping;
                    return true;
                }
                
                break;
            case MovementModes.Running:
                if(xVel == 0 && grounded)
                {
                    this.currentState = MovementModes.Idle;
                    return true;
                    
                }
                if(!grounded)
                {
                    this.currentState = MovementModes.Jumping;
                    return true;
                }
                
                break;  
            case MovementModes.Jumping:
                if(grounded && xVel == 0)
                {
                    this.currentState = MovementModes.Idle;
                    return true;
                    
                }
                if(grounded && xVel != 0)
                {
                    this.currentState = MovementModes.Running;
                    return true;
                }
                break;
            default:
                break;
        }
        
    }

    
};


