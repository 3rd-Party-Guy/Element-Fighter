export default class Singleton {
  // A private, static instances object
  static #instances = {};

  // When a class inherits Singleton, it's constructor will call this super constructor
  // First, it checks whether there is already an instance of the class, and if so, returns that.
  // Otherwise, the new instance is added to the static instances object.
  constructor() {
    if (Singleton.#instances.hasOwnProperty(this.constructor.name))
      return Singleton.#instances[this.constructor.name];

      Singleton.#instances[this.constructor.name] = this;
  }

  // This function works both as lazy-initialization and a getter for singletons.
  static getInstance(con) {
    if (!Singleton.#instances.hasOwnProperty(con.name))
      Singleton.#instances[con.name] = new con();

    return Singleton.#instances[con.name];
  }
}