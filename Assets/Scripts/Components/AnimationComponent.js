import State, { MovementModes, MovementState, AttackModes, AttackState } from "../StateMachine.js";
import AnimationDataContext from "../AnimationDataContext.js";
import Component from "./Component.js";

export default class AnimationComponent extends Component {
    
    // New empty animation data for movement and attack animations
    movement_state = new MovementState();
    attack_state = new AttackState();

    final_state = new State();

    animation_data_movement_state = new Map();
    animation_data_attack_state = new Map();

    update_speed = 240;
    last_update = 0;
    frame_index = 0;

    constructor(result)
    {
        super();

        //set animation data for movement states
        this.animation_data_movement_state.set(MovementModes.Idle,      new AnimationDataContext(result["spritesheets_path"] + "Movement/idle",  result["spritesheets_info"]["idle"]));
        this.animation_data_movement_state.set(MovementModes.Running,   new AnimationDataContext(result["spritesheets_path"] + "Movement/run",   result["spritesheets_info"]["run"]));
        this.animation_data_movement_state.set(MovementModes.Jumping,   new AnimationDataContext(result["spritesheets_path"] + "Movement/jump",  result["spritesheets_info"]["jump"]));
        this.animation_data_movement_state.set(MovementModes.Falling,   new AnimationDataContext(result["spritesheets_path"] + "Movement/fall",  result["spritesheets_info"]["fall"]));
        
        //set animation data for attack states
        this.animation_data_attack_state.set(AttackModes.None,          undefined);
        this.animation_data_attack_state.set(AttackModes.AttackLight,   new AnimationDataContext(result["spritesheets_path"] + "Attack/light_attack",   result["spritesheets_info"]["light_attack"]));
        this.animation_data_attack_state.set(AttackModes.AttackHeavy,   new AnimationDataContext(result["spritesheets_path"] + "Attack/heavy_attack",  result["spritesheets_info"]["heavy_attack"]));
        this.animation_data_attack_state.set(AttackModes.AbilityOne,    new AnimationDataContext(result["spritesheets_path"] + "Abilities/ability1",  result["spritesheets_info"]["ability1"]));
        this.animation_data_attack_state.set(AttackModes.AbilityTwo,    new AnimationDataContext(result["spritesheets_path"] + "Abilities/ability2",  result["spritesheets_info"]["ability2"]));
    
        this.last_update = Date.now();
    }

    get anim_data() {
        return (this.attack_state.current_state == AttackModes.None) ?
            this.animation_data_movement_state.get(this.movement_state.current_state) :
            this.animation_data_attack_state.get(this.attack_state.current_state);
    }

    get image_source() {
        return (this.is_flipped) ? this.anim_data.image_source_flipped : this.anim_data.image_source_normal;
    }

    get animation() {
        this.anim_data.image.src = this.image_source;
        return this.anim_data.image;
    }

    get frame_data() {
        return this.anim_data.frame_data;
    }

    update(vel_x, vel_y, is_grounded)
    {
        this.#updateAttackState();
        this.#updateMovementState(vel_x, vel_y, is_grounded);
        
        this.#updateAnimation();
        
        this.final_state = (this.attack_state == AttackModes.None) ? this.movement_state : this.attack_state;
    }

    #updateAnimation() {
        if ((Date.now() - this.last_update) < this.update_speed * this.frame_data["animation_scale"])
            return;

        let new_frame_index = this.frame_index + 1;

        if (new_frame_index >= this.frame_data["num_frames"]) {
            this.attack_state.current_state = AttackModes.None;
            new_frame_index = 0;
        }
        this.frame_index = new_frame_index;
        this.last_update = Date.now();
    }

    #updateMovementState(vel_x, vel_y, is_grounded)
    {
        if(this.attack_state.current_state != AttackModes.None) return;

        // When the state changes, we run the animation from the beginning
        if (this.movement_state.nextState({ 
            xVel: vel_x,
            yVel: vel_y,
            grounded: is_grounded
        }))
            this.#onStateChange();

        if (vel_x < 0)      this.is_flipped = true;
        else if (vel_x > 0) this.is_flipped = false;
    }

    #updateAttackState()
    {
        // When the state changes, we run the animation from the beginning
        if (this.attack_state.nextState({
            is_attacking: this.is_attacking,
            attacking_light: this.attacking_light,
            attacking_heavy: this.attacking_heavy,
            using_ability_one: this.using_ability_one,
            using_ability_two: this.using_ability_two
        }))
            this.#onStateChange();

        if (this.attack_state.current_state == 'none') return;
    }

    #onStateChange() {
        this.frame_index = 0;
    }
}