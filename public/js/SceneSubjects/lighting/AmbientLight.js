import * as THREE from '../../../jsm/three.module.js';

export class AmbientLight extends THREE.Object3D {
    constructor() {
        super();
        this.object = new THREE.AmbientLight(0xFFFFFF, 1, 100); //Add back
        this.object.intensity = 0.05;
        //this.object = new THREE.PointLight(0xFFFFFF, 1, 100);


    }

    setLightPosition(x, y, z) {
        this.object.position.set(x, y, z);

    }

    //if you want the lights to do any change every frame. When update is called in the scene manager, each subject's
    //update will be called. This light, if rendered first, which it is, currently, will affect every other object
    update(time) {
        //this.object.intensity = (Math.sin(time) + 1.5) / 2;
        //this.object.color.setHSL( Math.sin(time), 0.5, 0.5 );

    }
}
