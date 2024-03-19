import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand, DuckCommand, AttackLightCommand, AttackHeavyCommand, AbilityOneCommand, AbilityTwoCommand } from "./Command.js";
import Player from "./Player.js";

import InputManager from "./Singletons/InputManager.js";
import MapColliderManager from "./Singletons/MapColliderManager.js"
import CanvasManager from "./Singletons/CanvasManager.js";
import EntityManager from "./Singletons/EntityManager.js";

import PhysicsSystem from "./Singletons/Systems/PhysicsSystem.js"
import RenderingSystem from "./Singletons/Systems/RenderingSystem.js";
import AnimationSystem from "./Singletons/Systems/AnimationSystem.js";
import ColissionSystem from "./Singletons/Systems/CollisionSystem.js";
import UIRenderer from "./Singletons/UIRenderer.js";
import AudioSystem from "./Singletons/Systems/AudioSystem.js"

export default class Room{
    systems = [];

    #newFrameTime = 0;
    #deltaTime = 0;
    #lastFrameTime = performance.now();
    #accumulatedTime = 0;
    // FixedUpdate should run at 480FPS
    FIXED_DELTA_TIME = 1000 / 480;
    FIXED_DELTA = this.FIXED_DELTA_TIME / 1000; // delta must be passed in seconds

    inputManager = InputManager.getInstance(InputManager);
    map_collider_manager = MapColliderManager.getInstance(MapColliderManager);
    canvas_manager = CanvasManager.getInstance(CanvasManager);
    entity_manager = EntityManager.getInstance(EntityManager);

    physics_system = undefined;

    ui_renderer = UIRenderer.getInstance(UIRenderer);
    cur_map_name = "Vulcano";
    map_image = new Image();
    maps_data;
    characters_data;
    abilities_data;

    active_players = 0;

    constructor()
    {
       this.#setRoomData();
    }

    #setRoomData()
    {
        this.#addSystem(PhysicsSystem.getInstance(PhysicsSystem));
        this.#addSystem(AnimationSystem.getInstance(AnimationSystem));
        this.#addSystem(RenderingSystem.getInstance(RenderingSystem));
        this.#addSystem(ColissionSystem.getInstance(ColissionSystem));
        this.#addSystem(AudioSystem.getInstance(AudioSystem));
    }

    #addSystem(system)
    {
        this.systems.push(system);
        if(system.constructor.name === PhysicsSystem.name)
        {
            this.physics_system = system;
        }
    }

    async Initialize(maps_data, characters_data, abilities_data) {

        this.maps_data = maps_data;
        this.characters_data = characters_data;
        this.abilities_data = abilities_data;

        this.map_image.src = this.GetCurrentMapData().image_path;
        this.SpawnPlayer("Sylph");
        this.SpawnPlayer("Surtur");
        this.SetupMapCollisions();
        this.SetupInputMaps();

        // Setup Collision Canvas
        this.canvas_manager.collisionContext.fillStyle = "black";
        this.canvas_manager.collisionContext.globalCompositeOperation = "xor";
    }

    SetupMapCollisions() {
        const cur_map_data = this.GetCurrentMapData();

        for (const id in cur_map_data.hitboxes) {
            const h = cur_map_data["hitboxes"][id];

            this.map_collider_manager.addCollision(
                new Vector2(h.ld.x, h.ld.y),
                new Vector2(h.ru.x, h.ru.y),
                h.is_platform
            );
        }
    }

    GetAbilitiesObject(abilities) {
        let abilities_obj = {};

        for (const [ type, name ] of Object.entries(abilities)) {
            const data = this.abilities_data.find(e => e.name === name);

            if (data)
                abilities_obj[type] = data;
            else
                console.error(`Could not find ability data entry for name ${name}`);
        }

        return abilities_obj;
    }

    SpawnPlayer(name){
        const cur_map_data = this.GetCurrentMapData();

        // If there are 0 active players, spawn at spawn_position 1
        const spawn_pos_x = cur_map_data["spawn_positions"][this.active_players+1]["x"];
        const spawn_pos_y = cur_map_data["spawn_positions"][this.active_players+1]["y"];

        const player_data = this.characters_data.find(e => e.name == name);
        new Player(spawn_pos_x, spawn_pos_y, player_data, this.GetAbilitiesObject(player_data["abilities"]));

        this.active_players++;
    }

    SetupInputMaps() {
        const player_one = this.entity_manager.players[0];
        const player_two = this.entity_manager.players[1];
    
        // Add initial KeyCodes and Commands
        this.inputManager.addKeyboardInputActionLookup("KeyA", new MoveCommand(player_one, -140, 0));
        this.inputManager.addKeyboardInputActionLookup("KeyD", new MoveCommand(player_one, 140, 0));
        this.inputManager.addKeyboardInputActionLookup("KeyW", new JumpCommand(player_one));
        this.inputManager.addKeyboardInputActionLookup("KeyS", new DuckCommand(player_one));
   
        this.inputManager.addKeyboardInputActionLookup("ArrowLeft", new MoveCommand(player_two, -140, 0));
        this.inputManager.addKeyboardInputActionLookup("ArrowRight", new MoveCommand(player_two, 140, 0));
        this.inputManager.addKeyboardInputActionLookup("ArrowUp", new JumpCommand(player_two));
        this.inputManager.addKeyboardInputActionLookup("ArrowDown", new DuckCommand(player_two));
   
        this.inputManager.addKeyboardInputActionLookup("KeyJ", new AttackLightCommand(player_one));
        this.inputManager.addKeyboardInputActionLookup("KeyK", new AttackHeavyCommand(player_one));
        this.inputManager.addKeyboardInputActionLookup("KeyU", new AbilityOneCommand(player_one));
        this.inputManager.addKeyboardInputActionLookup("KeyI", new AbilityTwoCommand(player_one));
  
        this.inputManager.addKeyboardInputActionLookup("Numpad5", new AttackLightCommand(player_two));
        this.inputManager.addKeyboardInputActionLookup("Numpad6", new AttackHeavyCommand(player_two));
        this.inputManager.addKeyboardInputActionLookup("Numpad8", new AbilityOneCommand(player_two));
        this.inputManager.addKeyboardInputActionLookup("Numpad9", new AbilityTwoCommand(player_two));
    }

    RenderMap(){
        this.canvas_manager.gameplayContext.drawImage(this.map_image, 0, 0, 1280, 720, 0, 0, this.canvas_manager.width, this.canvas_manager.height);
    }

    GetCurrentMapData(){
        return this.maps_data.find(e => e.name === this.cur_map_name);
    }

    RoomLoop()
    { 
            this.#EarlyUpdate();
            this.#FixedUpdate();
            this.#Update();
            this.#LateUpdate();  
    }

    #EarlyUpdate() {
        // calculates deltaTime
        this.#newFrameTime = performance.now();
        this.#deltaTime = this.#newFrameTime - this.#lastFrameTime;
        this.#accumulatedTime += this.#deltaTime;
        this.#lastFrameTime = this.#newFrameTime;
    
        // clears attack signals from previous frame
        for (const p of this.entity_manager.players)
            p.clearAttackSignals();
    
        for (const system of this.systems)
            system.earlyUpdate();
        
        // handles input
        this.inputManager.handleInput();
    }
    
    #Update() {
        const delta = this.#deltaTime / 1000;
    
        // Clear Canvas before rendering again
        this.canvas_manager.clearCanvases();
    
        this.RenderMap();
        
        for(const system of this.systems)
            system.update(delta);
    
    
        this.entity_manager.updateEntities(delta);
    }
    
    #FixedUpdate() {
        while (this.#accumulatedTime >= this.FIXED_DELTA_TIME) {
            for (const system of this.systems)
                system.fixedUpdate(this.FIXED_DELTA);

                this.entity_manager.fixedUpdateEntities(this.FIXED_DELTA);
            this.#accumulatedTime -= this.FIXED_DELTA_TIME;
        }
    }
    
    #LateUpdate() {
        for (const system of this.systems)
            system.lateUpdate();
        
        this.ui_renderer.RenderUI();
        this.canvas_manager.gameplayContext.fill();
    }
}