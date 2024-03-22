import AnimationComponent from "./Components/AnimationComponent";
import RenderingComponent from "./Components/RenderingComponent";
import TransformComponent from "./Components/TransformComponent";

export default class UIInteractable extends Entity {
  #setEntityData(start_x, start_y, entity_data) {
    try {
      const width = entity_data["entity_info"]["width"];
      const height = entity_data["entity_info"]["height"];
  
      this.addComponent(new TransformComponent(new Vector2(start_x, start_y), width, height))
      this.addComponent(new AnimationComponent(entity_data, false));
      this.addComponent(new RenderingComponent());
    } catch (err) {
      console.error(`Error creating UI Entity\n${err}`);
    }
  }
}