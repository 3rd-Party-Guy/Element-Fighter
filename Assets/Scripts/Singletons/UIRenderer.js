import Singleton from "./Singleton.js";
import EntityManager from "./EntityManager.js";
import CanvasManager from "./CanvasManager.js";
import { clamp } from "../Math.js";

export default class UIRenderer extends Singleton {
    buffer_start_healthbar = 5;
    buffer_end_healthbar = 5;
    avatar_size = 85;
    ui_bar_size = 90;    
    
    y_buffer = 5;

    health_bar_image = new Image();
    mana_bar_image = new Image();
    
    avatar_one_image = new Image();
    avatar_two_image = new Image();

    constructor() {
        super();
        
        this.health_bar_image.src = 'Assets/Sprites/UI/HealthBar.png';
        this.mana_bar_image.src = 'Assets/Sprites/UI/ManaBar.png';

        this.#fetchPlayerAvatars();
    }

    RenderUI() {
        const ctx = CanvasManager.getInstance(CanvasManager).gameplayContext;

        this.#RenderPlayersBars(ctx);
        this.#RenderPlayersAvatars(ctx);
    }

    #fetchPlayerAvatars() {
        const player_one_avatar = EntityManager.getInstance(EntityManager).players[0]?.avatarPath;
        this.avatar_one_image.src = (player_one_avatar !== undefined) ? player_one_avatar + ".png" : "";

        const player_two_avatar = EntityManager.getInstance(EntityManager).players[1]?.avatarPath;
        this.avatar_two_image.src = (player_two_avatar !== undefined) ? player_two_avatar + "_flipped.png" : "";
    }

    #RenderPlayersBars(ctx) {
        let x_start, x_end, health_bar_width_dest, health_bar_width_source, mana_bar_width_dest, mana_bar_width_source = 0;
        
        // Player One
        const playerOne = EntityManager.getInstance(EntityManager).players[0];
        if (!playerOne) return;
        
        x_start = this.avatar_size + this.buffer_start_healthbar;
        x_end = 1280 / 2 - this.buffer_end_healthbar;
        
        health_bar_width_source = (500 / 100) * clamp(playerOne.health, 0, 100);
        health_bar_width_dest = ((x_end - x_start) / 100) * clamp(playerOne.health, 0, 100);
        
        mana_bar_width_source = (500 / 100) * clamp(playerOne.mana, 0, 100);
        mana_bar_width_dest = ((x_end - x_start) / 100) * clamp(playerOne.mana, 0, 100);

        ctx.drawImage(this.health_bar_image, 0, 0, health_bar_width_source, 50, x_start, this.y_buffer, health_bar_width_dest, 40);
        ctx.drawImage(this.mana_bar_image, 0, 0, mana_bar_width_source, 50, x_start, this.y_buffer + 40 + 5, mana_bar_width_dest, 40);

        // Player Two
        const playerTwo = EntityManager.getInstance(EntityManager).players[1];
        if (!playerTwo) return;
        
        x_start = 1280 - this.avatar_size - this.buffer_start_healthbar;
        x_end = 1280 / 2 + this.buffer_end_healthbar;
        
        health_bar_width_source = (500 / 100) * clamp(playerTwo.health, 0, 100);
        health_bar_width_dest = ((x_end - x_start) / 100) * clamp(playerTwo.health, 0, 100);

        mana_bar_width_source = (500 / 100) * clamp(playerTwo.mana, 0, 100);
        mana_bar_width_dest = ((x_end - x_start) / 100) * clamp(playerTwo.mana, 0, 100);

        ctx.drawImage(this.health_bar_image, 500, 0, -health_bar_width_source, 50, x_start, this.y_buffer, health_bar_width_dest, 40);
        ctx.drawImage(this.mana_bar_image, 500, 0, -mana_bar_width_source, 50, x_start, this.y_buffer + 40 + 5, mana_bar_width_dest, 40);
    }

    #RenderPlayersAvatars(ctx) {
        let x_start = 0;

        if (!this.avatar_one_image.src.endsWith(".png")) {
            this.#fetchPlayerAvatars();
            return;
        }

        x_start = 5;
        ctx.drawImage(this.avatar_one_image, 0, 0, 132, 132, x_start, 5, this.avatar_size, this.avatar_size);

        if (!this.avatar_two_image.src.endsWith(".png")) {
            this.#fetchPlayerAvatars();
            return;
        }

        x_start = 1280 - this.avatar_size - 5;
        ctx.drawImage(this.avatar_two_image, 0, 0, 132, 132, x_start, 5, this.avatar_size, this.avatar_size);
    }
}