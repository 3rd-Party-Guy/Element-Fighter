// Author:          Nikolay Hadzhiev
// Description:     This is the game entry-point

import Entity from "./Entity.js";

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let player = new Entity(75, 75, "Assets/Sprites/Knight - Debug/Knight.png", ctx);

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