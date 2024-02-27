import RenderingComponent from "./Scripts/Components/RenderingComponent.js";
import Entity from "./Scripts/Entity.js";
import EntityManager from "./Scripts/Singletons/EntityManager.js";

export default class Player extends Entity {
    onLoaded() {
        const entity_manager = EntityManager.getInstance(EntityManager);

        if (!entity_manager.playerOne)
            entity_manager.playerOne = this;
        else {
            entity_manager.playerTwo = this;
            this.getComponentOfType(RenderingComponent).is_flipped = true;
        }

        super.onLoaded();
    }
}