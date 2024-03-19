// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import InputManager from "./Singletons/InputManager.js";
import CanvasManager from "./Singletons/CanvasManager.js";
import Room from "./Room.js";


const inputManager = InputManager.getInstance(InputManager);
const canvas_manager = CanvasManager.getInstance(CanvasManager);

const ingame_room = new Room();

let maps_data;
let characters_data;
let abilities_data;


async function Initialize() {
    // Setup Event Callbacks
    window.addEventListener('keydown', (event) => inputManager.setKeyboardInput(event));
    window.addEventListener('keyup', (event) => inputManager.setKeyboardInput(event));
    window.addEventListener('click', (event) => getMousePos(event));    // INFO: Debug Only
    window.addEventListener('gamepadconnected', (e) => inputManager.connectGamepad(e.gamepad.index));

    maps_data = await ImportMaps();
    characters_data = await ImportCharacters();
    abilities_data = await ImportAbilities();


    ingame_room.Initialize(maps_data, characters_data, abilities_data);

}

// INFO: Only for debugging purposes
function getMousePos(e) {
    const rect = canvas_manager.clientRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`${x}, ${y}`);
}



async function ImportMaps() {
    const response = await fetch("Assets/maps.json");
    return await response.json();
}

async function ImportCharacters() {
    const response = await fetch("Assets/players.json");
    return await response.json();
}

async function ImportAbilities() {
    const response = await fetch("Assets/abilities.json");
    return await response.json();
}

// This is the main game loop. It is called every frame!
function GameLoop() {
  
    ingame_room.RoomLoop();
    // Move on to next frame
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = () => {
    Initialize();
    GameLoop();
}