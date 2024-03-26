import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";
import Entity from "./Entity.js";

export default class Button extends Entity {
  is_selected = false;
  button_data = undefined;

  constructor(start_x, start_y, button_data) {
    super(start_x, start_y, button_data, false);
    this.addComponent(new AudioPlayerComponent());

    this.button_data = button_data["button_info"];
    this.onLoaded();
  }

  onSelect() {
    if (this.is_selected) return;

    this.is_selected = true;
    this.getComponentOfType(AudioPlayerComponent).playOneShot(this.button_data.sounds.select_path);
  }
  
  onPress() {
    this.getComponentOfType(AudioPlayerComponent).playOneShot(this.button_data.sounds.press_path);
    switch(this.button_data.type) {
      case "change_room":
        // Room Manager change room
        break;
    }
  }
}