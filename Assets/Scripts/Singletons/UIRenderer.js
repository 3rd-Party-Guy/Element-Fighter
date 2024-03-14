import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js";
import CanvasManager from "./CanvasManager.js";
import { clamp } from "../Math.js";

export default class UIRenderer extends Singleton {
    buffer_start_healthbar = 5;
    buffer_end_healthbar = 5;
    avatar_size = 80;
    ui_bar_size = 90;    
    y_buffer = 5;

    health_bar_image = new Image();
    mana_bar_image = new Image();
    
    constructor() {
        super();
        
        this.health_bar_image.src = 'Assets/Sprites/UI/HealthBar.png';
        this.mana_bar_image.src = 'Assets/Sprites/UI/ManaBar.png';
    }

    RenderPlayersHealth() {
        const ctx = CanvasManager.getInstance(CanvasManager).gameplayContext;
        ctx.fillStyle = "red";
        
        let x_start, x_end, bar_width_dest, bar_width_source = 0;
        
        // Player One
        const playerOne = EntityManager.getInstance(EntityManager).players[0];
        if (!playerOne) return;
        
        x_start = this.avatar_size + this.buffer_start_healthbar;
        x_end = 1280 / 2 - this.buffer_end_healthbar;
        
        bar_width_dest = ((x_end - x_start) / 100) * clamp(playerOne.health, 0, 100);
        bar_width_source = (500 / 100) * clamp(playerOne.health, 0, 100);

        ctx.drawImage(this.health_bar_image, 0, 0, bar_width_source, 50, x_start, this.y_buffer, bar_width_dest, 45);
        
        // Player Two
        const playerTwo = EntityManager.getInstance(EntityManager).players[1];
        if (!playerTwo) return;
        
        x_start = 1280 - this.avatar_size - this.buffer_start_healthbar;
        x_end = 1280 / 2 + this.buffer_end_healthbar;
        
        bar_width_dest = ((x_end - x_start) / 100) * clamp(playerTwo.health, 0, 100);
        bar_width_source = (500 / 100) * clamp(playerTwo.health, 0, 100);

        ctx.drawImage(this.health_bar_image, 500, 0, -bar_width_source, 50, x_start, this.y_buffer, bar_width_dest, 45);
    }
}