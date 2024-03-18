import Component from "./Component";

export default class AudioPlayerComponent extends Component {
  audio = undefined;
  loop = false;

  constructor(source_path) {
    super();

    if (!source_path) return;
    this.audio = new Audio(source_path);
  }

  play() {
    if(!this.#canPlay()) return;

    this.audio.loop = this.loop;

    this.audio.play();
  }

  playOneShot(source_path) {
    if(!this.#canPlay()) return;

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

  #canPlay() {
    if (this.audio.readyState < 3) {
      console.warn('Audio not ready for playback. Omitting.');
      return false;
    }

    if (!this.audio.paused) {
      console.warn('Cannot interrupt audio. Omitting.')
      return false;
    }

    return true;
  }
}