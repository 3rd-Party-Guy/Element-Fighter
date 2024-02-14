// Author:          Nikolay Hadzhiev
// Description:     This is the game entry-point

import MoveCommand from "./Command.js";
import Entity from "./Entity.js";
import InputManager from "./InputManager.js";

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let player = new Entity(75, 75, "Assets/Sprites/Knight - Debug/Knight.png", ctx);


let inputManager = new InputManager(player);
inputManager.addInputActionLookUp(65, new MoveCommand(-1,0));
inputManager.addInputActionLookUp(68, new MoveCommand(1,0));
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