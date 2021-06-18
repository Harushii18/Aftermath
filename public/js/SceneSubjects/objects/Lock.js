//TO CODE!!

import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';

//import {loadingManager} from '../../managers/SceneManager.js'; //circular ref

export class Lock extends THREE.Object3D {
  constructor(loadingManager) {

    super();
    this.loadingManager = loadingManager;
    this.object = new THREE.Object3D();
    //this.object.castShadow = false;
    //this.object.receiveShadow = true;
    //load lock from blender file

    const loader = new GLTFLoader(this.loadingManager);
    loader.setPath('../../models/3DObjects/');

    const gltf = loader.load('lock.glb', (gltf) => {
      //console.log("loaded lock");

  /*    gltf.scene.traverse(c => {
        c.castShadow = true;
      });*/


  //===============================================
      //CHANGE SCALE + POSITION IT TO RIGHT PLACE!!
      this.object.scale.x = 1;
      this.object.scale.y = 1;
      this.object.scale.z = 1;
      //this.object.position.set(110, -0.5, 0);
      this.object.position.set(-14.5, 9.3, 81.3);
//===================================================
      this.object.add(gltf.scene);
    });



  }

setScale(scale){
  this.object.scale.x = scale.x;
  this.object.scale.y = scale.y;
  this.object.scale.z = scale.z;
}

  setPosition(position){
    this.object.position.set(position.x,position.y,position.z);
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
