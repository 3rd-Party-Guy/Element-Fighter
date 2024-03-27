import Entity from "./Entity.js";
import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";
import RoomManager from "./Singletons/RoomManager.js";
import EntityManager from "./Singletons/EntityManager.js";
import MenuManager from "./Singletons/MenuManager.js";

export default class Button extends Entity {
  button_data = undefined;

  constructor(start_x, start_y, button_data) {
    super(start_x, start_y, button_data, false);
    this.addComponent(new AudioPlayerComponent());

    this.button_data = button_data["button_info"];
    this.onLoaded();
  }

  onSelect() {
    this.getComponentOfType(AudioPlayerComponent).playOneShot(this.button_data.sounds.select_path);

    if (this.button_data.type === "select_character") {
      if (EntityManager.getInstance(EntityManager).selected_characters === 0)
        MenuManager.getInstance(MenuManager).render_char_one = this.button_data.character_name;
      else
        MenuManager.getInstance(MenuManager).render_char_two = this.button_data.character_name;
    }
  }
  
  onPress() {
    this.getComponentOfType(AudioPlayerComponent).playOneShot(this.button_data.sounds.press_path);
    switch(this.button_data.type) {
      case "change_room":
        RoomManager.getInstance(RoomManager).changeRoom(this.button_data.next_scene)
        break;
      case "select_character":
        EntityManager.getInstance(EntityManager).selectCharacter(this.button_data.character_name);
        break;
      case "select_map":
        RoomManager.getInstance(RoomManager).map_name = this.button_data.map_name;
      default:
        break;
    }
  }
}