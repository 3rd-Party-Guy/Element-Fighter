/// Author:         Nikolay Hadzhiev, Leon Enders
/// Description:    This is the statemachine a class handling states for entitys

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

export class MovementState{
    current_state = undefined;

    constructor() {
        this.current_state = MovementModes.Idle;
    }

    nextState(xVel, yVel, grounded)
    {
        switch (this.current_state) {
            case MovementModes.Idle:
                if(xVel !=0 && grounded) {
                    this.current_state = MovementModes.Running;
                    return true;
                }
                if(!grounded) {
                    this.current_state = (this.yVel < 0) ? MovementModes.Falling : MovementModes.Jumping;
                    return true;
                }
                break;

            case MovementModes.Running:
                if(Math.abs(xVel) < 50 && grounded) {
                    this.current_state = MovementModes.Idle;
                    return true;
                }
                if(!grounded) {
                    this.current_state = (yVel < -2) ? MovementModes.Falling : MovementModes.Jumping;
                    return true;
                }
                break;  

            case MovementModes.Jumping:
                if (yVel > 0) {
                    this.current_state = MovementModes.Falling;
                    return true;
                }
                if(grounded && xVel == 0) {
                    this.current_state = MovementModes.Idle;
                    return true;
                }
                if(grounded && xVel != 0) {
                    this.current_state = MovementModes.Running;
                    return true;
                }
                break;

            case MovementModes.Falling:
                if(grounded) {
                    this.current_state = (xVel == 0) ? MovementModes.Idle : MovementModes.Running;
                    return true;
                }
                break;
            default:
                break;
        }
        
        return false;
    }
};

export class AttackState {
    current_state = undefined;

    constructor() {
        this.current_state = AttackModes.None;
    }

    nextState(is_attacking, attacking_light, attacking_heavy, using_ability_one, using_ability_two) {
        if (is_attacking) return;
        
        if (attacking_light && this.current_state != AttackModes.AttackLight) {
            this.current_state = AttackModes.AttackLight;
            return true;
        }

        if (attacking_heavy && this.current_state != AttackModes.AttackHeavy) {
            this.current_state = AttackModes.AttackHeavy;
            return true;
        }

        if (using_ability_one && this.current_state != AttackModes.AbilityOne) {
            this.current_state = AttackModes.AbilityOne;
            return true;
        }

        if (using_ability_two && this.current_state != AttackModes.AbilityTwo) {
            this.current_state = AttackModes.AbilityTwo;
            return true;
        }

        if (this.current_state != AttackModes.None) {
            this.current_state = AttackModes.None;
            return true;
        }

        return false;
    }
}