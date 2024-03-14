export default class Singleton {
  // A private, static instances object
  static #instances = {};

  // When a class inherits Singleton, it's constructor will call this super constructor
  // First, it checks whether there is already an instance of the class, and if so, returns that.
  // Otherwise, the new instance is added to the static instances object.
  constructor() {
    const type_key = Symbol.for(this.constructor.name);

    if (Singleton.#instances[type_key])
      return Singleton.#instances[type_key];

      Singleton.#instances[type_key] = this;
  }

  // This function works both as lazy-initialization and a getter for singletons.
  static getInstance(con) {
    const type_key = Symbol.for(con.name);

    if (!Singleton.#instances[type_key])
      Singleton.#instances[type_key] = new con();

    return Singleton.#instances[type_key];
  }
}