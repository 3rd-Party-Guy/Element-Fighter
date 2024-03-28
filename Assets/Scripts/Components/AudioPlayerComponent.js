import Component from "./Component.js";

export default class AudioPlayerComponent extends Component {
  audio = undefined;
  loop = false;

  constructor(source_path) {
    super();

    this.audio = new Audio(source_path);
  }

  play(new_source) {
    if (new_source)
      this.audio.src = window.location.href + new_source;
    
    this.audio.loop = this.loop;
    this.audio.play();
  }

  playOneShot(source_path, force = false) {
    if (!this.audio.paused && !force) return;
    
    const old_loop = this.audio.loop;
    const old_source = this.audio.src;
    
    this.audio.src = source_path;
    this.audio.loop = false;

    this.audio.addEventListener('load', this.play());
    this.audio.addEventListener('ended', () => {
      this.audio.loop = old_loop;
      this.audio.src = old_source;
    });
  }
}