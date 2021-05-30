//this class keeps track of our current entities
export class LightingManager {
    constructor() {
        this.lights = [];
    }

    //typing the function outside will make it public as well (just like using this)
    register(light) {
        this.lights.push(light);
    }

    update(time) {
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].update(time);
        }
    }

    clear() {
        this.lights = [];
    }

    //need to account for destroying objects: removing them completely from the list
}