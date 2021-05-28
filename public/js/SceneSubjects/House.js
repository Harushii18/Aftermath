import {GLTFLoader} from '../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';

export class House extends THREE.Object3D {
  constructor() {

    super();
    this.object = new THREE.Object3D();
    //load house model form blender file

    const loader = new GLTFLoader();
    loader.setPath('../models/');

    const gltf = loader.load('Aftermath_Map2.glb', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });

      /*Scale to this size when using GameHouse.glb
      this.object.scale.x=6;
      this.object.scale.y=6;
      this.object.scale.z=6;
      */
      this.object.add(gltf.scene);
    });



  }

  return3DObject() {
    return this.object;
  }

  update(time) {
    //do nothing
  }
}
