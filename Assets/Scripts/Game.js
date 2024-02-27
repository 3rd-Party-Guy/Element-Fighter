// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand, DuckCommand } from "./Command.js";
import Entity from "./Entity.js";

import InputManager from "./Singletons/InputManager.js";
import MapColliderManager from "./Singletons/MapColliderManager.js"
import EntityManager from "./Singletons/EntityManager.js";
import CanvasManager from "./Singletons/CanvasManager.js";

import PhysicsSystem from "./Singletons/Systems/PhysicsSystem.js"
import RenderingSystem from "./Singletons/Systems/RenderingSystem.js";

// FixedUpdate should run at 480FPS
const FIXED_DELTA_TIME = 1000 / 480;

const inputManager = InputManager.getInstance(InputManager);
const mapColliderManager = MapColliderManager.getInstance(MapColliderManager);
const canvas_manager = CanvasManager.getInstance(CanvasManager);
const entity_manager = EntityManager.getInstance(EntityManager);

const physics_system = PhysicsSystem.getInstance(PhysicsSystem);
const render_system = RenderingSystem.getInstance(RenderingSystem);

const cur_map_name = "Vulcano";
const map_image = new Image();

let maps_data;
let characters_data;

async function Initialize() {
    // Add entities
    //new Entity(75, 75, "Mermaid");
    new Entity(240,245, "Minotaurus");   
    // Setup Event Callbacks
    window.addEventListener('keydown', (event) => inputManager.setInput(event));
    window.addEventListener('keyup', (event) => inputManager.setInput(event));
    window.addEventListener('click', (event) => getMousePos(event));

    window.addEventListener('gamepadconnected', (e) => {
        console.log("Gamepad detected.");
        
        const gp = navigator.getGamepads();
        console.log(gp);
    })

    maps_data = await ImportMaps();
    characters_data = await ImportCharacters();

    map_image.src = GetCurrentMap().image_path;
    SetupInputMaps();
    SetupMapCollisions();
}

// INFO: Only for debugging purposes
function getMousePos(e) {
    const rect = canvas_manager.clientRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log("x: " + x);
    console.log("y: " + y);
}

function SetupInputMaps() {
    // Add initial KeyCodes and Commands
    inputManager.addInputActionLookup("KeyA", new MoveCommand(-140,0));
    inputManager.addInputActionLookup("KeyD", new MoveCommand(140,0));
    inputManager.addInputActionLookup("KeyW", new JumpCommand());
    inputManager.addInputActionLookup("Space", new JumpCommand());
    inputManager.addInputActionLookup("KeyS", new DuckCommand());
}

async function ImportMaps() {
    const response = await fetch("Assets/maps.json");
    return await response.json();
}

async function ImportCharacters() {
    const response = await fetch("Assets/entities.json");
    return await response.json();
}

function SetupMapCollisions() {
    const cur_map = GetCurrentMap();

    for (const id in cur_map.hitboxes) {
        const h = cur_map["hitboxes"][id];

        mapColliderManager.addCollision(
            new Vector2(h.ld.x, h.ld.y),
            new Vector2(h.ru.x, h.ru.y),
            h.is_platform
        );
    }
}

function RenderMap() {
    canvas_manager.gameplayContext.drawImage(map_image, 0, 0, 1280, 720, 0, 0, 1280, 720);
}

function GetCurrentMap() {
    return maps_data.find(e => e.name === cur_map_name);
}

let newFrameTime = 0;
let deltaTime = 0;
let lastFrameTime = performance.now();
let accumulatedTime = 0;

function EarlyUpdate() {
    // calculates deltaTime
    newFrameTime = performance.now();
    deltaTime = newFrameTime - lastFrameTime;
    accumulatedTime += deltaTime;
    lastFrameTime = newFrameTime;

    // handles input
    inputManager.handleInput();
    //inputManager.handleInputPlayerTwo();
}

function Update() {
    // Clear Canvas before rendering again
    canvas_manager.clearGameplayCanvas();

    RenderMap();

    physics_system.update(deltaTime/1000);
    render_system.update(deltaTime / 1000);

    canvas_manager.gameplayContext.fill();
}

function FixedUpdate() {
    while (accumulatedTime >= FIXED_DELTA_TIME) {
        physics_system.fixedUpdate(FIXED_DELTA_TIME / 1000);

        accumulatedTime -= FIXED_DELTA_TIME;
    }
}

function LateUpdate() {

}

// This is the main game loop. It is called every frame!
function GameLoop() {
    EarlyUpdate();
    FixedUpdate();
    Update();
    LateUpdate();

    // Move on to next frame
    requestAnimationFrame(GameLoop);
}

// When the webpage gets loaded, this lambda-function gets called!
window.onload = () => {
    Initialize();
    GameLoop();
}