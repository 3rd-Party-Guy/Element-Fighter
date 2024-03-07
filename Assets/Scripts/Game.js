// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand, DuckCommand, AttackLightCommand, AttackHeavyCommand } from "./Command.js";
import Player from "./Player.js";

import InputManager from "./Singletons/InputManager.js";
import MapColliderManager from "./Singletons/MapColliderManager.js"
import CanvasManager from "./Singletons/CanvasManager.js";
import EntityManager from "./Singletons/EntityManager.js";

import PhysicsSystem from "./Singletons/Systems/PhysicsSystem.js"
import RenderingSystem from "./Singletons/Systems/RenderingSystem.js";
import AnimationSystem from "./Singletons/Systems/AnimationSystem.js";
import ColissionSystem from "./Singletons/Systems/CollisionSystem.js";

// FixedUpdate should run at 480FPS
const FIXED_DELTA_TIME = 1000 / 480;
const FIXED_DELTA = FIXED_DELTA_TIME / 1000; // delta must be passed in seconds

const inputManager = InputManager.getInstance(InputManager);
const map_collider_manager = MapColliderManager.getInstance(MapColliderManager);
const canvas_manager = CanvasManager.getInstance(CanvasManager);
const entity_manager = EntityManager.getInstance(EntityManager);

const physics_system = PhysicsSystem.getInstance(PhysicsSystem);
const animation_system = AnimationSystem.getInstance(AnimationSystem);
const render_system = RenderingSystem.getInstance(RenderingSystem);
const collision_system = ColissionSystem.getInstance(ColissionSystem);

const cur_map_name = "Atlantis";
const map_image = new Image();

let maps_data;
let characters_data;
let projectiles_data;

let active_players = 0;

async function Initialize() {
    // Setup Event Callbacks
    window.addEventListener('keydown', (event) => inputManager.setKeyboardInput(event));
    window.addEventListener('keyup', (event) => inputManager.setKeyboardInput(event));
    // window.addEventListener('click', (event) => getMousePos(event));    // INFO: Debug Only
    window.addEventListener('gamepadconnected', (e) => inputManager.connectGamepad(e.gamepad.index));

    maps_data = await ImportMaps();
    characters_data = await ImportCharacters();

    map_image.src = GetCurrentMapData().image_path;

    SpawnPlayer("Mermaid");
    SpawnPlayer("Minotaurus");

    SetupInputMaps();
    SetupMapCollisions();

    // Setup Collision Canvas
    canvas_manager.collisionContext.fillStyle = "black";
    canvas_manager.collisionContext.globalCompositeOperation = "xor";
}

// INFO: Only for debugging purposes
function getMousePos(e) {
    const rect = canvas_manager.clientRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`${x}, ${y}`);
}

function SetupInputMaps() {
    // Add initial KeyCodes and Commands
    inputManager.addKeyboardInputActionLookup("KeyA", new MoveCommand(-140, 0));
    inputManager.addKeyboardInputActionLookup("KeyD", new MoveCommand(140, 0));
    inputManager.addKeyboardInputActionLookup("KeyW", new JumpCommand());
    inputManager.addKeyboardInputActionLookup("Space", new JumpCommand());
    inputManager.addKeyboardInputActionLookup("KeyS", new DuckCommand());

    inputManager.addKeyboardInputActionLookup("KeyJ", new AttackLightCommand());
    inputManager.addKeyboardInputActionLookup("KeyK", new AttackHeavyCommand());
}

async function ImportMaps() {
    const response = await fetch("Assets/maps.json");
    return await response.json();
}

async function ImportCharacters() {
    const response = await fetch("Assets/players.json");
    return await response.json();
}

function SetupMapCollisions() {
    const cur_map_data = GetCurrentMapData();

    for (const id in cur_map_data.hitboxes) {
        const h = cur_map_data["hitboxes"][id];

        map_collider_manager.addCollision(
            new Vector2(h.ld.x, h.ld.y),
            new Vector2(h.ru.x, h.ru.y),
            h.is_platform
        );
    }
}

function SpawnPlayer(name) {
    const cur_map_data = GetCurrentMapData();

    // If there are 0 active players, spawn at spawn_position 1
    const spawn_pos_x = cur_map_data["spawn_positions"][active_players+1]["x"];
    const spawn_pos_y = cur_map_data["spawn_positions"][active_players+1]["y"];

    const player_data = characters_data.find(e => e.name == name);
    new Player(spawn_pos_x, spawn_pos_y, player_data);

    active_players++;
}

function RenderMap() {
    canvas_manager.gameplayContext.drawImage(map_image, 0, 0, 1280, 720, 0, 0, canvas_manager.width, canvas_manager.height);
}

function GetCurrentMapData() {
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

    // clears attack signals from previous frame
    for (const p of entity_manager.players)
        p.clearAttackSignals();

    // handles input
    inputManager.handleInput();
}

function Update() {
    const delta = deltaTime / 1000;

    // Clear Canvas before rendering again
    canvas_manager.clearCanvases();

    RenderMap();

    animation_system.update(delta);
    physics_system.update(delta);
    render_system.update(delta);
    collision_system.update(delta);

    entity_manager.updateEntities(delta);
}

function FixedUpdate() {
    while (accumulatedTime >= FIXED_DELTA_TIME) {
        physics_system.fixedUpdate(FIXED_DELTA);
        entity_manager.fixedUpdateEntities(FIXED_DELTA);

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