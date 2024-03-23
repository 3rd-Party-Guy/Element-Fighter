import AnimationComponent from "./Components/AnimationComponent.js";
import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import TransformComponent from "./Components/TransformComponent.js";
import Entity from "./Entity.js";

export default class Button extends Entity {
  is_selected = false;
  button_data = undefined;

  constructor(start_x, start_y, button_data) {
    super(start_x, start_y, button_data, false);
    this.addComponent(new AudioPlayerComponent());

    this.button_data = button_data;
    this.onLoaded();
  }

  onSelect() {
    this.getComponentOfType(AudioPlayerComponent).playOneShot(this.button_data.sounds.select_sound_path);
  }
}