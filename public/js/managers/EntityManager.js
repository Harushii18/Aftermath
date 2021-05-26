//this class keeps track of our current entities
export class EntityManager {
    constructor() {
        this.entities = [];
    }

    //typing the function outside will make it public as well (just like using this)
    register(entity) {
        this.entities.push(entity);
    }

    update(time) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(time);
        }
    }

    clear() {
        this.entities = [];
    }

    //need to account for destroying objects: removing them completely from the list
}