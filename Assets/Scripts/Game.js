// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import InputManager from "./Singletons/InputManager.js";
import CanvasManager from "./Singletons/CanvasManager.js";
import Room from "./Room.js";

const input_manager = InputManager.getInstance(InputManager);
const canvas_manager = CanvasManager.getInstance(CanvasManager);

const room = new Room();

let maps_data;
let characters_data;
let abilities_data;
let rooms_data;

let current_room_index = 0;

// let active_players = 0;

// Fetches all JSON data and adds the needed event listeners
async function Initialize() {
    // Setup Event Callbacks
    window.addEventListener('keydown', (event) => input_manager.setKeyboardInput(event));
    window.addEventListener('keyup', (event) => input_manager.setKeyboardInput(event));
    window.addEventListener('click', (event) => getMousePos(event));    // INFO: Debug Only
    window.addEventListener('gamepadconnected', (e) => input_manager.connectGamepad(e.gamepad.index));

    rooms_data = await ImportRooms();
    maps_data = await ImportMaps();
    characters_data = await ImportCharacters();
    abilities_data = await ImportAbilities();

    // Enter Main Menu
    room.Enter(getRoomDataByName("Splash"), {
        characters_data,
        maps_data
    });
}

// INFO: Only for debugging purposes
// Gets the current mouse position and outputs it as in-game coordinates
function getMousePos(e) {
    const rect = canvas_manager.clientRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`${x}, ${y}`);
}

function getRoomDataByName(name) {
    return rooms_data.find(e => e.name === name);
}

// Imports all information from maps.json as an object
async function ImportMaps() {
    const response = await fetch("Assets/maps.json");
    return await response.json();
}

// Imports all information from players.json as an object
async function ImportCharacters() {
    const response = await fetch("Assets/players.json");
    return await response.json();
}

// Imports all information from abilities.json as an object
async function ImportAbilities() {
    const response = await fetch("Assets/abilities.json");
    return await response.json();
}

// Imports all rooms from rooms.json as an object
async function ImportRooms() {
    const response = await fetch("Assets/rooms.json");
    return await response.json();
}

// This is the main game loop. It is called every frame!
function GameLoop() {
    room.RoomLoop();

    if (room.CheckLeaveConditions()) {
        room.Leave();
        current_room_index++;
        room.Enter(getRoomDataByName(room.room_data.next), {
            maps_data,
            characters_data,
            abilities_data
        });
    }

    // Move on to next frame
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = async () => {
    await Initialize();
    GameLoop();
}