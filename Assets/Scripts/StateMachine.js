/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    This is the statemachine a class handling states for entitys

// Different state machines used for the entities
// Every state is a state mode, with different states
// having different connections and conditions which can be found
// in the nextState switch statement
export const MovementModes = Object.freeze({
    Idle: 'idle',
    Running: 'running',
    Jumping: 'jumping',
    Falling: 'falling'
});

export const AttackModes = Object.freeze({
    None: 'none',
    AttackLight: 'attack light',
    AttackHeavy: 'attack heavy',
    AbilityOne: 'ability one',
    AbilityTwo: 'ability two'
});

export default class State {
    current_state = undefined;

    nextState(data) {

    }
}

export class MovementState extends State {
    constructor() {
        super();
        this.current_state = MovementModes.Idle;
    }

    nextState(data)
    {
        switch (this.current_state) {
            case MovementModes.Idle:
                if(data.xVel !=0 && data.grounded) {
                    this.current_state = MovementModes.Running;
                    return true;
                }
                if(!data.grounded) {
                    this.current_state = (data.yVel < 0) ? MovementModes.Falling : MovementModes.Jumping;
                    return true;
                }
                break;

            case MovementModes.Running:
                if(Math.abs(data.xVel) < 50 && data.grounded) {
                    this.current_state = MovementModes.Idle;
                    return true;
                }
                if(!data.grounded) {
                    this.current_state = (data.yVel < -2) ? MovementModes.Falling : MovementModes.Jumping;
                    return true;
                }
                break;  

            case MovementModes.Jumping:
                if (data.yVel > 0) {
                    this.current_state = MovementModes.Falling;
                    return true;
                }
                if(data.grounded && data.xVel == 0) {
                    this.current_state = MovementModes.Idle;
                    return true;
                }
                if(data.grounded && data.xVel != 0) {
                    this.current_state = MovementModes.Running;
                    return true;
                }
                break;

            case MovementModes.Falling:
                if(data.grounded) {
                    this.current_state = (data.xVel == 0) ? MovementModes.Idle : MovementModes.Running;
                    return true;
                }
                break;
            default:
                break;
        }
        
        return false;
    }
};

export class AttackState extends State {
    constructor() {
        super();
        this.current_state = AttackModes.None;
    }

    nextState(data) {
        if (data.attacking_light && this.current_state != 'attack light') {
            this.current_state = AttackModes.AttackLight;
            return true;
        }

        if (data.attacking_heavy && this.current_state != 'attack heavy') {
            this.current_state = AttackModes.AttackHeavy;
            return true;
        }

        if (data.using_ability_one && this.current_state != AttackModes.AbilityOne) {
            this.current_state = AttackModes.AbilityOne;
            return true;
        }

        if (data.using_ability_two && this.current_state != AttackModes.AbilityTwo) {
            this.current_state = AttackModes.AbilityTwo;
            return true;
        }

        return false;
    }
}