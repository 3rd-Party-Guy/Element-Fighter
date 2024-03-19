import Singleton from "../Singleton.js";

export default class System extends Singleton {
  earlyUpdate(delta_time) {}
  fixedUpdate(fixed_delta_time) {}
  update(delta_time) {}
  lateUpdate(delta_time) {}
}