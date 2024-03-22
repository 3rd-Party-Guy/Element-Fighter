import AnimationComponent from "./Components/AnimationComponent.js";
import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";
import RenderingComponent from "./Components/RenderingComponent.js";
import TransformComponent from "./Components/TransformComponent.js";
import Entity from "./Entity.js";

export default class Button extends Entity {
  is_selected = false;
  button_data = undefined;

  constructor(start_x, start_y, button_data) {

    this.addComponent(new AudioPlayerComponent());

    this.button_data = button_data;
  }

  #setEntityData(start_x, start_y, entity_data) {
    try {
      console.log("correct");

      const width = entity_data["entity_info"]["width"];
      const height = entity_data["entity_info"]["height"];
  
      this.addComponent(new TransformComponent(new Vector2(start_x, start_y), width, height))
      this.addComponent(new AnimationComponent(entity_data, false));
      this.addComponent(new RenderingComponent());
    } catch (err) {
      console.error(`Error creating UI Entity\n${err}`);
    }
  }

  onSelect() {

  }
}