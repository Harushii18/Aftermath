import * as THREE from '../../../jsm/three.module.js';

export class CeilingLight extends THREE.Object3D {
    constructor() {
        super();
        this.object = new THREE.PointLight(0x7E0B0A, 1, 100);
        this.object.castShadow = true;

        this.object.shadow.mapSize.width = 1024;
        this.object.shadow.mapSize.height = 1024;

        this.object.shadow.camera.near = 500;
        this.object.shadow.camera.far = 4000;
        this.object.shadow.camera.fov = 30;
    }

    setLightPosition(x, y, z) {
        this.object.position.set(x, y, z);

    }

    //if you want the lights to do any change every frame. When update is called in the scene manager, each subject's
    //update will be called. This light, if rendered first, which it is, currently, will affect every other object
    update(time) {
        this.object.intensity = (Math.sin(time) + 1.5) / 2;
        //  this.object.color.setHSL( Math.sin(time), 0.5, 0.5 );

    }
}