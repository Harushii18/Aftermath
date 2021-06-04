import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class LetterI extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');



        var gltf = loader.load('letterI.glb', (gltf) => {
          //console.log("loaded letter I");
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale letter
            this.object.scale.x = 4;
            this.object.scale.y = 4;
            this.object.scale.z = 4;

            //rotate letter
            this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);

            //move letter
            this.object.position.set(34, 17, 45.5);

            this.object.add(gltf.scene);
        });

    }

    update(time) {

     //do nothing
    }



}
