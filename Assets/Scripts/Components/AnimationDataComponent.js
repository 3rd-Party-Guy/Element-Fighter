import { AttackState, MovementState } from "../StateMachine.js";
import { AttackModes, MovementModes } from "../StateMachine.js";
import AnimationDataContext from "../AnimationDataContext.js";
import Component from "./Component.js";

export default class AnimationDataComponent extends Component {
    
    // New empty animation data for movement and attack animations
    movement_state = new MovementState();
    attack_state = new AttackState();

    animation_data_movement_state = new Map();
    animation_data_attack_state = new Map();

    state_animation = undefined;
    state_frame_data = undefined;


    //Properties to update attackstate
    is_attacking = false;
    attacking_light = false;
    attacking_heavy = false;
    using_ability_one = false;
    using_ability_two = false;

    //Boolean to pass to rendering component to reset frame index
    state_changed = false;

    constructor(result)
    {
        super();

        //set animation data for movement states
        this.animation_data_movement_state.set(MovementModes.Idle,      new AnimationDataContext(result["spritesheets_path"] + "Movement/idle",  result["spritesheets_info"]["idle"]));
        this.animation_data_movement_state.set(MovementModes.Running,   new AnimationDataContext(result["spritesheets_path"] + "Movement/run",   result["spritesheets_info"]["run"]));
        this.animation_data_movement_state.set(MovementModes.Jumping,   new AnimationDataContext(result["spritesheets_path"] + "Movement/jump",  result["spritesheets_info"]["jump"]));
        this.animation_data_movement_state.set(MovementModes.Falling,   new AnimationDataContext(result["spritesheets_path"] + "Movement/fall",  result["spritesheets_info"]["fall"]));
        
        //set animation data for attack states
        this.animation_data_attack_state.set(AttackModes.None,      new AnimationDataContext());
        this.animation_data_attack_state.set(AttackModes.AttackLight,   new AnimationDataContext(result["spritesheets_path"] + "Attack/light_attack",   result["spritesheets_info"]["light_attack"]));
        this.animation_data_attack_state.set(AttackModes.AttackHeavy,   new AnimationDataContext(result["spritesheets_path"] + "Attack/heavy_attack",  result["spritesheets_info"]["heavy_attack"]));
        this.animation_data_attack_state.set(AttackModes.AbilityOne,   new AnimationDataContext(result["spritesheets_path"] + "Abilities/ability1",  result["spritesheets_info"]["ability1"]));
        this.animation_data_attack_state.set(AttackModes.AbilityTwo,   new AnimationDataContext(result["spritesheets_path"] + "Abilities/ability2",  result["spritesheets_info"]["ability2"]));
        
    }

    update(vel_x, vel_y, is_grounded)
    {
        //this.#updateAttackState();
        this.#updateMovementState(vel_x, vel_y, is_grounded);
    }

    #updateMovementState(vel_x, vel_y, is_grounded)
    {
        //if(this.attack_state.current_state == AttackModes.None) return;
     
        if (this.movement_state.nextState(vel_x, vel_y, is_grounded))
            this.state_changed = true;

        if (vel_x < 0)      this.is_flipped = true;
        else if (vel_x > 0) this.is_flipped = false;

        let state_anim_data = this.animation_data_movement_state.get(this.movement_state.current_state);
        this.state_animation = state_anim_data.image;
        this.state_animation.src = (this.is_flipped) ? state_anim_data.image_source_flipped : state_anim_data.image_source_normal;
        this.state_frame_data = this.animation_data_movement_state.get(this.movement_state.current_state).frame_data;
    }

    #updateAttackState()
    {
        if (this.attack_state.nextState(this.is_attacking, this.attacking_light, this.attacking_heavy, this.using_ability_one, this.using_ability_two))
            this.state_changed = true;

            let state_anim_data = this.animation_data_attack_state.get(this.attack_state.current_state);
            this.state_animation = state_anim_data.image;
            this.state_animation.src = (this.is_flipped) ? state_anim_data.image_source_flipped : state_anim_data.image_source_normal;
            this.state_frame_data = this.animation_data_attack_state.get(this.attack_state.current_state).frame_data;
       
    }
}