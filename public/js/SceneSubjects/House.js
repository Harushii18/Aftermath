import { GLTFLoader } from '../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';
import {loadingManager} from '../managers/SceneManager.js';
export class House extends THREE.Object3D {
  constructor() {

    super();
    this.object = new THREE.Object3D();
    //this.object.castShadow = false;
    this.object.receiveShadow = true;
    //load house model from blender file
    this.loadCount = 0;

    const loader = new GLTFLoader(loadingManager);
    loader.setPath('../models/');


    //while(this.loadCount==0){
  //    console.log("in house loop");
        const gltf = loader.load('NEWHOUSE.glb', (gltf) => {
          this.loadCount = 1;
          console.log("load house");
          gltf.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
          });
          gltf.scene.traverse((node) => {
            if(node.isMesh){
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

      //Scaling house
      this.object.scale.x = 8;
      this.object.scale.y = 8;
      this.object.scale.z = 8;
      this.object.position.set(110, -0.5, 0);

      this.object.add(gltf.scene);
    });
//}


  }

  return3DObject() {
    return this.object;
  }

  update(time) {
    //do nothing
  }
}
