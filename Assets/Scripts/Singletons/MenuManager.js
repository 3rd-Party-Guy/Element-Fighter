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
    let lastdistancesqrd = 999;
    let next_button = undefined;
    let validButtons = [];


    for(const button of this.buttons)
    {
      if(button === this.current_button)continue;
      if(button.y < this.current_button.y){
       validButtons.push(button);
      }
    }

    
    for( const button of validButtons)
    {
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          next_button = button;
        }
      
    }
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  selectDown(){
    if(!this.current_button) return;
    let lastdistancesqrd = 999;
    let next_button = undefined;
    let validButtons = [];


    for(const button of this.buttons)
    {
      if(button === this.current_button)continue;
      if(button.y > this.current_button.y){
       validButtons.push(button);
      }
    }

    
    for( const button of validButtons)
    {
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          next_button = button;
        }
      
    }
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  selectLeft(){
    if(!this.current_button) return;
    let lastdistancesqrd = 999;
    let next_button = undefined;
    let validButtons = [];


    for(const button of this.buttons)
    {
      if(button === this.current_button)continue;
      if(button.x < this.current_button.x){
       validButtons.push(button);
      }
    }

    
    for( const button of validButtons)
    {
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          next_button = button;
        }
      
    }
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  selectRight(){
    if(!this.current_button) return;
    let lastdistancesqrd = 999;
    let next_button = undefined;
    let validButtons = [];


    for(const button of this.buttons)
    {
      if(button === this.current_button)continue;
      if(button.x > this.current_button.x){
       validButtons.push(button);
      }
    }

    
    for( const button of validButtons)
    {
        let distancesqrd = Math.sqrt(this.current_button.x - button.x) + Math.sqrt(this.current_button.y - button.y);
        if(distancesqrd < lastdistancesqrd){
          lastdistancesqrd = distancesqrd;
          next_button = button;
        }
      
    }
    this.current_button = next_button;
    this.current_button.onSelect();
  }
}