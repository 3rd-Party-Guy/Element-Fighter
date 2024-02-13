// Author:          Nikolay Hadzhiev
// Description:     This is the game entry-point

import Entity from "./Entity";

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let player = new Entity(75, 75, "Assets/Sprites/Knight - Debug/Knight.png")

function GameLoop() {
    player.update();
    player.draw();
    requestAnimationFrame(GameLoop);
}

window.onload = () => {
    GameLoop();
}