import { GLTFLoader } from '../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';
import {loadingManager} from '../managers/SceneManager.js';
export class House extends THREE.Object3D {
  constructor() {

    super();
    this.object = new THREE.Object3D();
    //this.object.castShadow = false;
    this.object.receiveShadow = true;
    //load house model form blender file

    const loader = new GLTFLoader(loadingManager);
    loader.setPath('../models/');

    const gltf = loader.load('newhouse.glb', (gltf) => {

      gltf.scene.traverse(c => {
        c.castShadow = true;
      });

  
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
