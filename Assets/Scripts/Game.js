// Author:          Nikolay Hadzhiev
// Description:     This is the game entry-point

import Entity from "./Entity.js";
import InputManager from "./InputManager.js";
import { InputMappingContext } from "./InputManager.js";

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let player = new Entity(75, 75, "Assets/Sprites/Knight - Debug/Knight.png", ctx);


// Create InputMappingContext, mapping InputKeys to InputActions
let iMC = new InputMappingContext(65,68,32,17,81,87, 69, 82);

let inputManager = new InputManager(player, iMC);

window.addEventListener('keydown', (event)=>{inputManager.handleInput(event.keyCode)} ) ;


// This is the main game loop. It is called every frame!
function GameLoop() {
    player.update();
    player.render(ctx);
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = () => {
    GameLoop();
}