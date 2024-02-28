import RenderingComponent from "./Components/RenderingComponent.js";
import Entity from "./Entity.js";
import EntityManager from "./Singletons/EntityManager.js";

export default class Player extends Entity {
    onLoaded() {
        EntityManager.getInstance(EntityManager).addPlayer(this);
    }
}