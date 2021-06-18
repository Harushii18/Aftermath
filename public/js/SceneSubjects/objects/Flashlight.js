import * as THREE from '../../../jsm/three.module.js';
import {GLTFLoader} from '../../../jsm/GLTFLoader.js';
//import {loadingManager} from '../../managers/SceneManager.js';
export class Flashlight extends THREE.Object3D {


	constructor(loadingManager) {
		super();

                this.loadingManager = loadingManager;
        this.object = new THREE.Object3D();
        //load house model form blender file

        const loader = new GLTFLoader(this.loadingManager);
        loader.setPath('../../models/3DObjects/');

        const gltf = loader.load('flashlight.glb', (gltf) => {
       /*   gltf.scene.traverse(c => {
				
            c.castShadow = true;
          });*/

          this.object.position.set(7, 8, 80);

          this.object.add(gltf.scene);
        });

	}
  
	update(time) {
        //
	}




}
