// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import MoveCommand from "./Command.js";
import Entity from "./Entity.js";
import InputManager from "./InputManager.js";

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let player = new Entity(75, 75, "Knight");

const inputManager = InputManager.getInstance(InputManager);

inputManager.givePlayer(player);

// Add initial KeyCodes and Commands
inputManager.addInputActionLookUp("KeyA", new MoveCommand(-4,0));
inputManager.addInputActionLookUp("KeyD", new MoveCommand(4,0));

// Add Input Manager's HandleInput as Callback to KeyDown Event
window.addEventListener('keydown', (event) => inputManager.handleInput(event.code));
window.addEventListener('keyup', (event) => inputManager.handleInput(event.code));

// This is the main game loop. It is called every frame!
function GameLoop() {
    // Clear Canvas before rendering again
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Update entities
    player.update();
    player.render(ctx);

    // Move on to next frame
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = () =>
    GameLoop();