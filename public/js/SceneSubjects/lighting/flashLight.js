import * as THREE from '../../../jsm/three.module.js';
import { mainChar } from '../../managers/SceneManager.js';

export class flashLight extends THREE.Object3D {
    constructor() {
        super();
        this.object = new THREE.SpotLight( 0xffffff );
        //this.object.position.set( 100, 1000, 100 );
        
        this.object.castShadow = true;
        
        this.object.shadow.mapSize.width = 1024;
        this.object.shadow.mapSize.height = 1024;
        
        this.object.shadow.camera.near = 500;
        this.object.shadow.camera.far = 4000;
        this.object.shadow.camera.fov = 30;

        this.object.visible = false;

    }

    setLightPosition(x, z) {
        this.object.position.set(0, 8, 50);

    }

    toggleVisibility(){
        this.object.visible = !this.object.visible;
    }

    //if you want the lights to do any change every frame. When update is called in the scene manager, each subject's
    //update will be called. This light, if rendered first, which it is, currently, will affect every other object
    update(time) {
    //     let pos = mainChar.returnWorldPosition();
    //     let rot = mainChar.y;

    //    // console.log(rot);

    //     this.object.position.set(pos.x, pos.y, pos.z);
    //    // this.object.setRotationFromEuler(rot);
    //    // this.object.rotateY = rot;
        //PUT THIS BACK LATER
      //  this.object.intensity = (Math.sin(time) + 1.5) / 2;
      

    }
}