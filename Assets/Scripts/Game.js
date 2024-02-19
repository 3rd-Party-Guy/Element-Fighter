// Author:          Nikolay Hadzhiev, Leon Enders
// Description:     This is the game entry-point

import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand } from "./Command.js";
import Entity from "./Entity.js";

import InputManager from "./InputManager.js";
import MapColliderManager from "./MapColliderManager.js"

const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

// 60 physics steps / second
const FIXED_TIME_STEP = 1000/60;

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
    inputManager.addInputActionLookUp("KeyA", new MoveCommand(-140,0));
    inputManager.addInputActionLookUp("KeyD", new MoveCommand(140,0));
    inputManager.addInputActionLookUp("KeyW", new JumpCommand());
}

function SetupMapCollisions() {
    mapColliderManager.addCollision(
        new Vector2(64, 290),
        new Vector2(580, 310)
    );
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
    ctx.beginPath();

    for(const ent of entities) {
        ent.update();
        ent.render(ctx);
    }

    // Render CollisionBoxes
    mapColliderManager.renderBoxes(ctx);
    ctx.fill();
}

function FixedUpdate() {
    while (accumulatedTime >= FIXED_TIME_STEP) {
        for (const ent of entities)
            ent.fixedUpdate(FIXED_TIME_STEP/1000);
    
        accumulatedTime -= FIXED_TIME_STEP;
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