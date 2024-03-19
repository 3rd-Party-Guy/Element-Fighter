import AudioPlayerComponent from "../../Components/AudioPlayerComponent.js";
import PhysicsComponent from "../../Components/PhysicsComponent.js";
import EntityManager from "../EntityManager.js";
import System from "./System.js";

export default class AudioSystem extends System {
    update(delta) {
        for (const p of EntityManager.getInstance(EntityManager).players) {
            const should_play_jump = p.getComponentOfType(PhysicsComponent).just_jumped;
            
            if (should_play_jump)
                p.getComponentOfType(AudioPlayerComponent).playOneShot(p.sound_data.jump);
        }
    }
}