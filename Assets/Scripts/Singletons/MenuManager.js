import Singleton from "./Singleton.js";

export default class MenuManager extends Singleton {
  buttons = {};
  current_button = undefined;

  addButton(button) {
    const key = Symbol.for(button.name);
    if (this.buttons[key]) return;

    this.buttons[key] = button;
  }

  getButton(name) {
    const key = Symbol.for(name);
    return this.buttons[key];
  }

  selectButton(name) {
    const key = Symbol.for(name);
    const selected = this.buttons[key];
    if (!selected) return;

    this.current_button = selected;
    selected.onSelect();
  }

  pressButton() {
    selected.onPress();
  }

  clear() {
    this.buttons = {};
    this.current_button = {};
  }

  selectUp(){
    if(!this.current_button) return;
    let lastdistancesqrd = 0;
    for(button of this.buttons)
    {
      if(button.y < this.current_button.y){
        this.current_button = button;
        continue;
      }
      if(button.y === this.current_button.y){
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          this.current_button = button;
        }
      }
    }
  }

  selectDown(){
    if(!this.current_button) return;
    let lastdistancesqrd = 0;
    for(button of this.buttons)
    {
      if(button.y > this.current_button.y){
        this.current_button = button;
        this.current_button.onSelect();
        continue;
      }
      if(button.y === this.current_button.y){
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          this.current_button = button;
          this.current_button.onSelect();
        }
      }
    }
  }

  selectLeft(){
    if(!this.current_button) return;
    let lastdistancesqrd = 0;
    for(button of this.buttons)
    {
      if(button.x < this.current_button.x){
        this.current_button = button;
        this.current_button.onSelect();
        continue;
      }
      if(button.x === this.current_button.x){
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          this.current_button = button;
          this.current_button.onSelect();
        }
      }
    }
  }

  selectRight(){
    if(!this.current_button) return;
    let lastdistancesqrd = 0;
    for(button of this.buttons)
    {
      if(button.x > this.current_button.x){
        this.current_button = button;
        this.current_button.onSelect();
        continue;
      }
      if(button.x === this.current_button.x){
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          this.current_button = button;
          this.current_button.onSelect();
        }
      }
    }
  }
}