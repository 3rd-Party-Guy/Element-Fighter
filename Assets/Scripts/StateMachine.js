/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    This is the statemachine a class handling states for entitys

export const MovementModes = Object.freeze({
    Idle: 'idle',
    Running: 'running',
    Jumping: 'jumping',
    Falling: 'falling'
})

export default class MovementState{
    currentState = MovementModes.Idle;

    constructor() {}

    nextState(xVel, yVel, grounded)
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
                    this.currentState = (this.yVel < 0) ? MovementModes.Falling : MovementModes.Jumping;
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
                    this.currentState = (yVel < -2) ? MovementModes.Falling : MovementModes.Jumping;
                    return true;
                }
                break;  

            case MovementModes.Jumping:
                if (yVel > 0) {
                    this.currentState = MovementModes.Falling;
                    return true;
                }
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
            case MovementModes.Falling:
                if(grounded) {
                    this.currentState = (xVel == 0) ? MovementModes.Idle : MovementModes.Running;
                    return true;
                }
                break;
            default:
                break;
        }
        
    }

    
};


