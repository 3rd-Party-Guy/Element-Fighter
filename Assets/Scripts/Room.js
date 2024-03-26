import Vector2 from "./Vector2.js";

import { MoveCommand, JumpCommand, DuckCommand, AttackLightCommand, AttackHeavyCommand, AbilityOneCommand, AbilityTwoCommand } from "./Command.js";
import Player from "./Player.js";

import InputManager from "./Singletons/InputManager.js";
import MapColliderManager from "./Singletons/MapColliderManager.js"
import CanvasManager from "./Singletons/CanvasManager.js";
import EntityManager from "./Singletons/EntityManager.js";
import Entity from "./Entity.js";

import PhysicsSystem from "./Singletons/Systems/PhysicsSystem.js"
import RenderingSystem from "./Singletons/Systems/RenderingSystem.js";
import AnimationSystem from "./Singletons/Systems/AnimationSystem.js";
import ColissionSystem from "./Singletons/Systems/CollisionSystem.js";
import UIRenderer from "./Singletons/UIRenderer.js";
import AudioSystem from "./Singletons/Systems/AudioSystem.js"
import Button from "./Button.js";
import MenuManager from "./Singletons/MenuManager.js";

import AudioPlayerComponent from "./Components/AudioPlayerComponent.js";

// A room is simply a different level.
// This allows us to have different entities and logic for different parts of the game,
// e.g. the main menu vs the fighting level
export default class Room {
    // These are all of the systems that will be used in this room
    systems = [];

    // Used to compute the delta time. This is the amount of time inbetween the last and current frame.
    // Necessary for making computations that should not be based on the FPS/time.
    #newFrameTime = 0;
    #deltaTime = 0;
    #lastFrameTime = performance.now();
    #accumulatedTime = 0;

    // FixedUpdate should run at 480FPS
    FIXED_DELTA_TIME = 1000 / 480;
    FIXED_DELTA = this.FIXED_DELTA_TIME / 1000; // delta must be passed in seconds

    // Directly initializing and instancing the managers we need.
    // This defeats the purpose of lazy-initialization, but since we will be referencing them a lot,
    // it is a good trade.
    input_manager = InputManager.getInstance(InputManager);
    map_collider_manager = MapColliderManager.getInstance(MapColliderManager);
    canvas_manager = CanvasManager.getInstance(CanvasManager);
    entity_manager = EntityManager.getInstance(EntityManager);
    menu_manager = MenuManager.getInstance(MenuManager);

    ui_renderer = UIRenderer.getInstance(UIRenderer);
    cur_map_name = "Vulcano";
    map_image = new Image();

    room_data = undefined;
    maps_data = undefined;
    characters_data = undefined;
    abilities_data = undefined;
    buttons_data = undefined;

    active_players = 0;

    background_music = new AudioPlayerComponent();

    get name() {
        return this.room_data.name || "";
    }

    get next() {
        return this.room_data.next;
    }

    // Pushes a system to the systems array
    #addSystem(system)
    {
        this.systems.push(system);
    }

    getButtonDataByName(name) {
        return this.buttons_data.find(e => e.name === name);
    }

    constructor() {
        this.#setupSystems();
        this.background_music.loop = true;
    }

    #setupSystems() {
        this.#addSystem(AudioSystem.getInstance(AudioSystem));
        this.#addSystem(RenderingSystem.getInstance(RenderingSystem));
        this.#addSystem(PhysicsSystem.getInstance(PhysicsSystem));
        this.#addSystem(ColissionSystem.getInstance(ColissionSystem));
        this.#addSystem(AnimationSystem.getInstance(AnimationSystem));
    }

    // This functions gets (and sets) all the needed data needed, e.g. map data, map background image, etc.
    // Also spawns the players and calls for other setup
    Enter(room_data, data) {
        this.room_data = room_data;

        switch (this.name) {
            case "Splash":
                this.buttons_data = data.buttons_data;
                this.menu_manager.addButton(new Button(320, 180, this.getButtonDataByName("Splash Button")));
                break;
            case "Main Menu":
                this.buttons_data = data.buttons_data;
                this.menu_manager.selectButton("Splash Button");

                this.background_music.play('Assets/SFX/Music/menu.wav');
                this.map_image.src = 'Assets/Sprites/UI/Overlays/titlescreen.png';

                break;
            case "Character Select":
                this.buttons_data = data.buttons_data;

                this.background_music.play('Assets/SFX/Music/character_select.wav');
                this.map_image.src = 'Assets/Sprites/UI/Overlays/characterselect.png';

                break;
            case "Game":
                this.abilities_data = data.abilities_data;
                this.maps_data = data.maps_data;
                this.characters_data = data.characters_data;

                this.map_image.src = this.GetCurrentMapData().image_path;
                this.SetupMapCollisions();
                
                this.SpawnPlayer("Mermaid");
                this.SpawnPlayer("Minotaurus");
                
                this.SetupInputMaps();
                
                // Setup Collision Canvas
                this.canvas_manager.collisionContext.fillStyle = "black";
                this.canvas_manager.collisionContext.globalCompositeOperation = "xor";
                break;
            default:
                break;
        }
    }

    Leave() {
        this.entity_manager.clear();
        this.map_collider_manager.clear();
        this.input_manager.clear();
        this.menu_manager.clear();
    
        this.active_players = 0;
    }

    CheckLeaveConditions() {
        switch (this.name) {
            case "Splash":
            case "Main Menu":
            case "Character Select":
                break;
            case "Game":
                for (const p of this.entity_manager.players)
                    if (p.health <= 0) return true;
                break;
            default:
                return true;
        }

        return false;
    }

    // This functions scrapes the JSON data (see maps.json) of the current map,
    // and sets each collision box for it
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

    // This functions scrapes the abilities JSON file and creates an object with all of the info
    // of the abilities that are needed. This is intented to be fed into the player entitys constructor
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

    // Gets the spawn position based on which player it is (1, 2, 3, or 4)
    // (currently only 2 players are supported)
    SpawnPlayer(name){
        const cur_map_data = this.GetCurrentMapData();

        // If there are 0 active players, spawn at spawn_position 1
        const spawn_pos_x = cur_map_data["spawn_positions"][this.active_players + 1]["x"];
        const spawn_pos_y = cur_map_data["spawn_positions"][this.active_players + 1]["y"];

        const player_data = this.characters_data.find(e => e.name == name);
        new Player(spawn_pos_x, spawn_pos_y, player_data, this.GetAbilitiesObject(player_data["abilities"]));

        this.active_players++;
    }

    // Sets up the initial keyboard input lookups for both players
    SetupInputMaps() {
        const player_one = this.entity_manager.players[0];
        const player_two = this.entity_manager.players[1];
    
        // Add initial KeyCodes and Commands
        this.input_manager.addKeyboardInputActionLookup("KeyA", new MoveCommand(player_one, -140, 0));
        this.input_manager.addKeyboardInputActionLookup("KeyD", new MoveCommand(player_one, 140, 0));
        this.input_manager.addKeyboardInputActionLookup("KeyW", new JumpCommand(player_one));
        this.input_manager.addKeyboardInputActionLookup("KeyS", new DuckCommand(player_one));
   
        this.input_manager.addKeyboardInputActionLookup("ArrowLeft", new MoveCommand(player_two, -140, 0));
        this.input_manager.addKeyboardInputActionLookup("ArrowRight", new MoveCommand(player_two, 140, 0));
        this.input_manager.addKeyboardInputActionLookup("ArrowUp", new JumpCommand(player_two));
        this.input_manager.addKeyboardInputActionLookup("ArrowDown", new DuckCommand(player_two));
   
        this.input_manager.addKeyboardInputActionLookup("KeyJ", new AttackLightCommand(player_one));
        this.input_manager.addKeyboardInputActionLookup("KeyK", new AttackHeavyCommand(player_one));
        this.input_manager.addKeyboardInputActionLookup("KeyU", new AbilityOneCommand(player_one));
        this.input_manager.addKeyboardInputActionLookup("KeyI", new AbilityTwoCommand(player_one));
  
        this.input_manager.addKeyboardInputActionLookup("Numpad5", new AttackLightCommand(player_two));
        this.input_manager.addKeyboardInputActionLookup("Numpad6", new AttackHeavyCommand(player_two));
        this.input_manager.addKeyboardInputActionLookup("Numpad8", new AbilityOneCommand(player_two));
        this.input_manager.addKeyboardInputActionLookup("Numpad9", new AbilityTwoCommand(player_two));
    }

    // Renders the map background image over the whole gameplay canvas
    RenderMap(){
        this.canvas_manager.gameplayContext.drawImage(this.map_image, 0, 0, 1280, 720, 0, 0, this.canvas_manager.width, this.canvas_manager.height);
    }

    // Get the JSON data for the map with the correct name
    GetCurrentMapData(){
        return this.maps_data.find(e => e.name === this.cur_map_name);
    }

    // The main game loop, called in Game.js
    RoomLoop()
    { 
        this.#EarlyUpdate();
        this.#FixedUpdate();
        this.#Update();
        this.#LateUpdate();
    }
    
    // EarlyUpdate is the first method called at the beginning of the game loop each frame
    // Calculates the delta time, clears the attack signals of the last frame for all players,
    // registers input
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
        this.input_manager.handleInput();
    }
    
    // Update is the main method of the game loop. It is called after EarlyUpdate
    // Clears canvases, renders the map
    #Update() {
        const delta = this.#deltaTime / 1000;
    
        // Clear Canvas before rendering again
        this.canvas_manager.clearCanvases();
    
        this.RenderMap();
        
        for(const system of this.systems)
            system.update(delta);
    
    
        this.entity_manager.updateEntities(delta);
    }
    
    // FixedUpdate is called every 1/480th of a second.
    // The while loop ensures that missed calls are accumulated and also called
    #FixedUpdate() {
        while (this.#accumulatedTime >= this.FIXED_DELTA_TIME) {
            for (const system of this.systems)
                system.fixedUpdate(this.FIXED_DELTA);

                this.entity_manager.fixedUpdateEntities(this.FIXED_DELTA);
            this.#accumulatedTime -= this.FIXED_DELTA_TIME;
        }
    }

    // LateUpdate is the final method called in the game loop.
    // It renders UI and fills the collision canvas with black.
    #LateUpdate() {
        for (const system of this.systems)
            system.lateUpdate();
        
        this.ui_renderer.RenderUI();
        this.canvas_manager.gameplayContext.fill();
    }
}