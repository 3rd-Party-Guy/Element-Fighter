import Singleton from "./Singleton.js";
import Room from "../Room.js";

export default class RoomManager extends Singleton {
    rooms_data = {};
    maps_data = {};
    characters_data = {};
    abilities_data = {};
    buttons_data = {};

    all_room_data = {};

    current_room = new Room();

    async Initialize() {
        await Promise.all([
            this.ImportRooms(),
            this.ImportMaps(),
            this.ImportCharacters(),
            this.ImportAbilities(),
            this.ImportButtons()
        ]);

        this.all_room_data = {
            maps_data: this.maps_data,
            characters_data: this.characters_data,
            abilities_data: this.abilities_data,
            buttons_data: this.buttons_data
        }
    }

    loop() {
        this.current_room.RoomLoop();

        if (this.current_room.CheckLeaveConditions())
            this.changeRoom(this.getRoomDataByName(this.current_room.name).next);
    }

    changeRoom(name) {
        this.current_room.Leave();
        this.current_room.Enter(this.getRoomDataByName(name), this.all_room_data);
    }
    
    getRoomDataByName(name) {
        return this.rooms_data.find(e => e.name === name);
    }
    
    // Imports all rooms from rooms.json as an object
    async ImportRooms() {
        const response = await fetch("Assets/rooms.json");
        this.rooms_data = await response.json();
    }
    
    // Imports all information from maps.json as an object
    async ImportMaps() {
        const response = await fetch("Assets/maps.json");
        this.maps_data = await response.json();
    }
    
    // Imports all information from players.json as an object
    async ImportCharacters() {
        const response = await fetch("Assets/players.json");
        this.characters_data = await response.json();
    }
    
    // Imports all information from abilities.json as an object
    async ImportAbilities() {
        const response = await fetch("Assets/abilities.json");
        this.abilities_data = await response.json();
    }
    
    // Import all buttons from buttons.json as an object
    async ImportButtons() {
        const response = await fetch("Assets/buttons.json");
        this.buttons_data = await response.json();
    }
}