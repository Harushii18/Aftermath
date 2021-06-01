import { GLTFLoader } from '../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';

export class House extends THREE.Object3D {
  constructor() {

    super();
    this.object = new THREE.Object3D();
    //this.object.castShadow = false;
    this.object.receiveShadow = true;
    //load house model form blender file

    const loader = new GLTFLoader();
    loader.setPath('../models/');

    const gltf = loader.load('bedroom.glb', (gltf) => {

      gltf.scene.traverse(c => {
        c.castShadow = true;
      });

      //Scale to this size when using GameHouse.glb
      //Scaling house
      this.object.scale.x = 8;
      this.object.scale.y = 8;
      this.object.scale.z = 8;
      this.object.position.set(110, -0.5, 0);

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
