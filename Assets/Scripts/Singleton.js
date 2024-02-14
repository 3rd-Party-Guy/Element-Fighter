// Author:          Nikolay Hadzhiev
// Description:     This file is supposed to document and implement all the logic for the singletons used in the project.
//                  Every singleton is only initialized once using lazy-initialization.

class Singleton {
    // only one instance per class
    static instance = undefined;

    // private function
    #CreateInstance() {
        let object = Object.freeze(new Singleton());
        return object;
    }

    GetInstance() {
        if (instance == undefined)
            instance = this.#CreateInstance();
        
        return instance;
    }
};