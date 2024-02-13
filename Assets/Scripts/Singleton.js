// Author:          Nikolay Hadzhiev
// Description:     This file is supposed to document and implement all the logic for the singletons used in the project.
//                  Every singleton is only initialized once using lazy-initialization.

class Singleton {
    static instance = undefined;

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