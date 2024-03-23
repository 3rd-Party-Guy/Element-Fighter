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

  clear() {
    this.buttons = {};
    this.current_button = {};
  }
}