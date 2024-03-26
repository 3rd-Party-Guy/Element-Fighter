// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import InputManager from "./Singletons/InputManager.js";
import CanvasManager from "./Singletons/CanvasManager.js";
import Room from "./Room.js";
import RoomManager from "./Singletons/RoomManager.js";

const input_manager = InputManager.getInstance(InputManager);
const canvas_manager = CanvasManager.getInstance(CanvasManager);
const room_manager = RoomManager.getInstance(RoomManager);


// Fetches all JSON data and adds the needed event listeners
async function Initialize() {
    // Setup Event Callbacks
    window.addEventListener('keydown', (event) => input_manager.setKeyboardInput(event));
    window.addEventListener('keyup', (event) => input_manager.setKeyboardInput(event));
    window.addEventListener('click', (event) => getMousePos(event));    // INFO: Debug Only
    window.addEventListener('gamepadconnected', (e) => input_manager.connectGamepad(e.gamepad.index));

    await room_manager.Initialize();

    // Enter Main Menu
    room_manager.changeRoom("Splash");
}

// INFO: Only for debugging purposes
// Gets the current mouse position and outputs it as in-game coordinates
function getMousePos(e) {
    const rect = canvas_manager.clientRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`${x}, ${y}`);
}

// This is the main game loop. It is called every frame!
function GameLoop() {
    room_manager.loop();

    // Move on to next frame
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = async () => {
    await Initialize();
    GameLoop();
}