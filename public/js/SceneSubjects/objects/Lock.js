//TO CODE!!

import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import * as THREE from '../../../../jsm/three.module.js';
import {loadingManager} from '../../managers/SceneManager.js';
export class Lock extends THREE.Object3D {
  constructor() {

    super();
    this.object = new THREE.Object3D();
    //this.object.castShadow = false;
    this.object.receiveShadow = true;
    //load lock from blender file

    const loader = new GLTFLoader(loadingManager);
    loader.setPath('../../models/3DObjects/');

    const gltf = loader.load('lock.glb', (gltf) => {

      gltf.scene.traverse(c => {
        c.castShadow = true;
      });

  //===============================================
      //CHANGE SCALE + POSITION IT TO RIGHT PLACE!!
      this.object.scale.x = 8;
      this.object.scale.y = 8;
      this.object.scale.z = 8;
      this.object.position.set(110, -0.5, 0);
//===================================================
      this.object.add(gltf.scene);
    });



  }

  return3DObject() {
    return this.object;
  }

  update(time) {
      //=========TODO=============================================
    //We need to make sure that once cupboard is opened, lock either
    //1. falls on floor
    //2. disappears (gets placed somewhere else/ destroyed)
    //=========TODO==================================================
  }
}
