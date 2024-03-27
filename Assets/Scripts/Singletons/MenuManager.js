import Singleton from "./Singleton.js";
import CanvasManager from "./CanvasManager.js";

export default class MenuManager extends Singleton {
  buttons = {};
  current_button = undefined;

  cursor_image = undefined;

  render_char_one = "Mermaid";
  render_char_two = "Mermaid";

  preview_image_one = new Image(288, 384);
  preview_image_two = new Image(288, 384);

  changeCursor(src, width, height) {
    this.cursor_image = new Image(width, height);
    this.cursor_image.src = src;
  }

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
    this.current_button.onSelect();
  }

  pressButton() {
    if (!this.current_button)
      return;

    this.current_button.onPress();
  }

  clear() {
    this.buttons = {};
    this.current_button = {};
  }

  selectUp() {
    if(!this.current_button) return;

    let lastdistance = 999;
    let next_button = undefined;
    let validButtons = [];

    const symbols = Object.getOwnPropertySymbols(this.buttons);
    for(const s of symbols)
    {
      const button = this.buttons[s];

      if(button === this.current_button) continue;
      if(button.transform.position.y < this.current_button.transform.position.y){
       validButtons.push(button);
      }
    }
    
    for( const button of validButtons)
    {
      let distance = Math.sqrt(
        Math.pow(this.current_button.transform.position.x - button.transform.position.x, 2) + 
        Math.pow(this.current_button.transform.position.y - button.transform.position.y, 2)
      );
      
      if(distance < lastdistance){
        lastdistance = distance;
        next_button = button;
      }
    }

    if(!next_button) return;
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  selectDown() {
    if (!this.current_button) return;

    let lastdistance = 999;
    let next_button = undefined;
    let validButtons = [];
  
    const symbols = Object.getOwnPropertySymbols(this.buttons);
    for(const s of symbols)
    {
      const button = this.buttons[s];

      if(button === this.current_button) continue;
      if(button.transform.position.y > this.current_button.transform.position.y){
       validButtons.push(button);
      }
    }
    
    for( const button of validButtons)
    {
        let distance = Math.sqrt(
          Math.pow(this.current_button.transform.position.x - button.transform.position.x, 2) + 
          Math.pow(this.current_button.transform.position.y - button.transform.position.y, 2)
        );

        if(distance < lastdistance){
          lastdistance = distance;
          next_button = button;
        }
      
    }

    if(!next_button) return;
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  selectLeft() {
    if(!this.current_button) return;
    let lastdistance = 999;
    let next_button = undefined;
    let validButtons = [];

    const symbols = Object.getOwnPropertySymbols(this.buttons);
    for(const s of symbols)
    {
      const button = this.buttons[s];

      if(button === this.current_button) continue;
      if(button.transform.position.x < this.current_button.transform.position.x){
       validButtons.push(button);
      }
    }
    
    for( const button of validButtons)
    {
        let distance = Math.sqrt(
          Math.pow(this.current_button.transform.position.x - button.transform.position.x, 2) + 
          Math.pow(this.current_button.transform.position.y - button.transform.position.y, 2)
        );

        if(distance < lastdistance){
          lastdistance = distance;
          next_button = button;
        }
      
    }
    
    if (!next_button) return;
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  selectRight() {
    if(!this.current_button) return;
    let lastdistance = 999;
    let next_button = undefined;
    let validButtons = [];

    const symbols = Object.getOwnPropertySymbols(this.buttons);
    for(const s of symbols)
    {
      const button = this.buttons[s];

      if(button === this.current_button) continue;
      if(button.transform.position.x > this.current_button.transform.position.x){
       validButtons.push(button);
      }
    }
    
    for( const button of validButtons)
    {
        let distance = Math.sqrt(
          Math.pow(this.current_button.transform.position.x - button.transform.position.x, 2) + 
          Math.pow(this.current_button.transform.position.y - button.transform.position.y, 2)
        );
        
        if(distance < lastdistance){
          lastdistance = distance;
          next_button = button;
        }
      
    }

    if(!next_button) return;
    this.current_button = next_button;
    this.current_button.onSelect();
  }

  renderCursor() {
    if (!this.cursor_image) return;
    if (this.cursor_image.src.endsWith("undefined")) return;
    if (!this.current_button) return;
    if (!this.current_button.transform) return;

    const ctx = CanvasManager.getInstance(CanvasManager).gameplayContext;
    ctx.drawImage(
      this.cursor_image,
      this.current_button.transform.position.x,
      this.current_button.transform.position.y
    );
  }

  renderPreviews() {
    this.preview_image_one.src = `/Assets/Sprites/Characters/Previews/${this.render_char_one}.png`;
    this.preview_image_two.src = `/Assets/Sprites/Characters/Previews/${this.render_char_two}_flipped.png`;

    const ctx = CanvasManager.getInstance(CanvasManager).gameplayContext;
    ctx.drawImage(this.preview_image_one, 100, 250);
    ctx.drawImage(this.preview_image_two, 925, 250);
  }
}