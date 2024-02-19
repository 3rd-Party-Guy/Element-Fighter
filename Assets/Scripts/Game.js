// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand } from "./Command.js";
import Entity from "./Entity.js";

import InputManager from "./InputManager.js";
import MapColliderManager from "./MapColliderManager.js"

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

// FixedUpdate should run at 240FPS
const FIXED_DELTA_TIME = 1000 / 240;

const inputManager = InputManager.getInstance(InputManager);
const mapColliderManager = MapColliderManager.getInstance(MapColliderManager);

let entities = [];

function Initialize() {
    // Add entities
    entities.push(new Entity(75, 75, "Knight", canvas));
    
    // INFO: not clean
    inputManager.givePlayer(entities[0]);
    
    // Setup Event Callbacks
    window.addEventListener('keydown', (event) => inputManager.setInput(event));
    window.addEventListener('keyup', (event) => inputManager.setInput(event));

    SetupInputMaps();
    SetupMapCollisions();
}

function SetupInputMaps() {
    // Add initial KeyCodes and Commands
    inputManager.addInputActionLookup("KeyA", new MoveCommand(-140,0));
    inputManager.addInputActionLookup("KeyD", new MoveCommand(140,0));
    inputManager.addInputActionLookup("KeyW", new JumpCommand());
}

function SetupMapCollisions() {
    mapColliderManager.addCollision(
        new Vector2(64, 290),
        new Vector2(580, 310)
    );

    mapColliderManager.addBoxRenders(ctx);
}

let newFrameTime = 0;
let deltaTime = 0;
let lastFrameTime = performance.now();
let accumulatedTime = 0;

function EarlyUpdate() {
    // calculates deltaTime
    newFrameTime = performance.now();
    deltaTime = newFrameTime-lastFrameTime;
    accumulatedTime += deltaTime;
    lastFrameTime = newFrameTime;

    // handles input
    inputManager.handleInput();
}

function Update() {
    // Clear Canvas before rendering again
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    for(const ent of entities) {
        ent.update(deltaTime / 1000);
        ent.render(ctx);
    }

    ctx.fill();
}

function FixedUpdate() {
    while (accumulatedTime >= FIXED_DELTA_TIME) {
        for (const ent of entities)
            ent.fixedUpdate(FIXED_DELTA_TIME / 1000);
    
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