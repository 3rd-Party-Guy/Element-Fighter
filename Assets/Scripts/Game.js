// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand } from "./Command.js";
import Entity from "./Entity.js";

import InputManager from "./InputManager.js";
import MapColliderManager from "./MapColliderManager.js"

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

let player = new Entity(75, 75, "Knight", canvas);

const inputManager = InputManager.getInstance(InputManager);
const mapColliderManager = MapColliderManager.getInstance(MapColliderManager);

inputManager.givePlayer(player);


// Add Input Manager's HandleInput as Callback to KeyDown Event
window.addEventListener('keydown', (event) => inputManager.setInput(event));
window.addEventListener('keyup', (event) => inputManager.setInput(event));

function SetupInputMaps() {
    // Add initial KeyCodes and Commands
    inputManager.addInputActionLookUp("KeyA", new MoveCommand(-1.7,0));
    inputManager.addInputActionLookUp("KeyD", new MoveCommand(1.7,0));
    inputManager.addInputActionLookUp("KeyW", new JumpCommand());

}

function SetupMapCollisions() {
    mapColliderManager.addCollision(
        new Vector2(64, 290),
        new Vector2(580, 310)
    );
}

// This is the main game loop. It is called every frame!
function GameLoop() {
    // Clear Canvas before rendering again
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // Handle Input
    inputManager.handleInput();

    // Update entities
    player.update();
    player.render(ctx);

    // Render CollisionBoxes
    mapColliderManager.renderBoxes(ctx);

    // Move on to next frame
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = () => {
    SetupInputMaps();
    SetupMapCollisions();
    GameLoop();
}