import * as THREE from '../jsm/three.module.js';
export class Time {
    constructor() {
        this.is_pause = false;
        this.accumalated_run_time = 0;
        this.clock = new THREE.Clock();
        this.pause_clock = new THREE.Clock();
    }


    getRunTime() {
        this.accumalated_run_time += this.clock.getDelta();
        return this.accumalated_run_time
    }

    pause() {
        this.is_pause = true;

    }

    unpause() {
        this.is_pause = false;
        this.clock.getDelta();
    }

    getElapsedTime()
    {
        return this.clock.getElapsedTime();
    }

}