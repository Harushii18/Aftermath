import * as THREE from '../../../jsm/three.module.js';
import {GLTFLoader} from '../../../jsm/GLTFLoader.js';
import {loadingManager} from '../../managers/SceneManager.js';
export class CeilingLightObj extends THREE.Object3D {


	constructor() {
		super();
        this.object = new THREE.Object3D();
        //load house model form blender file

        const loader = new GLTFLoader(loadingManager);
        loader.setPath('../../models/objects/');

        const gltf = loader.load('ceilingLight2.glb', (gltf) => {
         /* gltf.scene.traverse(c => {
						//console.log("loaded ceiling light");
            c.castShadow = true;
          });*/

          this.object.scale.x = 1;
          this.object.scale.y = 1;
          this.object.scale.z = 1;

          //Scale to this size when using GameHouse.glb
          //Scaling house



          this.object.add(gltf.scene);
        });

	}
    setLightPosition(x,z){
        //0,21,30
        this.object.position.set(x, 18, z);
    }
	update(time) {

	}




}
