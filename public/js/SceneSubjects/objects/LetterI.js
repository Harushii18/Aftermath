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
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale letter
            this.object.scale.x = 4;
            this.object.scale.y = 4;
            this.object.scale.z = 4;

            //move letter
            this.object.position.set(15, 17, 32.8);

            this.object.add(gltf.scene);
        });

    }

    update(time) {

     //do nothing 
    }



}
