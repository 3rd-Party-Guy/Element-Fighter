import State, { MovementModes, MovementState, AttackModes, AttackState } from "../StateMachine.js";
import AnimationDataContext from "../AnimationDataContext.js";
import Component from "./Component.js";

export default class AnimationComponent extends Component {
    // New empty animation data for movement and attack animations
    movement_state = new MovementState();
    attack_state = new AttackState();

    animation_data_movement_state = new Map();
    animation_data_attack_state = new Map();

    update_speed = 240;
    last_update = 0;
    frame_index = 0;

    // Component flags for entities
    flags_set = false;
    is_state_machine = true;
    is_flipped = false;

    constructor(result, is_state_machine)
    {
        super();
        this.is_state_machine = is_state_machine;

        this.last_update = Date.now();

        if (!is_state_machine) {
            this.animation_data_movement_state.set("idle", new AnimationDataContext(result["spritesheets_path"], result["spritesheets_info"]["animation"]));
            this.attack_state.current_state = AttackModes.None;
            this.movement_state.current_state = MovementModes.Idle;

            return;
        }

        //set animation data for movement states
        for(const key in result.spritesheets_info)
        {
            let state_mode = MovementModes[result["spritesheets_info"][key]["state_info"]];
            this.animation_data_movement_state.set(state_mode, new AnimationDataContext(result["spritesheets_path"],result["spritesheets_info"][key]));
        }

        this.animation_data_attack_state.set(AttackModes.None, undefined);
        for(const key in result.spritesheets_info) {
            let state_mode = AttackModes[result["spritesheets_info"][key]["state_info"]];
            this.animation_data_attack_state.set(state_mode, new AnimationDataContext(result["spritesheets_path"],result["spritesheets_info"][key]));
        }
    }

    get anim_data() {
        if (this.attack_state.current_state == "none")
            return this.animation_data_movement_state.get(this.movement_state.current_state);

        return this.animation_data_attack_state.get(this.attack_state.current_state);
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

    update(vel_x, vel_y, is_grounded, attacking_data) {
        this.#updateIsFlipped(vel_x);
        if(this.is_state_machine)
        {
            this.#updateAttackState(attacking_data);
            this.#updateMovementState(vel_x, vel_y, is_grounded);
        }
        this.#updateAnimation();
    }

    #updateIsFlipped(vel_x) {
        if (vel_x < 0)      this.is_flipped = true;
        else if (vel_x > 0) this.is_flipped = false;
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
    }

    #updateAttackState(attacking_data)
    {
        // When the state changes, we run the animation from the beginning
        if (this.attack_state.nextState(attacking_data))
            this.#onStateChange();
    }

    #onStateChange() {
        this.frame_index = 0;
    }
}