import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';

export class Key extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.open = false;

        var gltf = loader.load('key.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            this.object.scale.x = 0.4;
            this.object.scale.y = 0.4;
            this.object.scale.z = 0.4;


            this.object.position.set(13.6, 8, 38);



            this.object.add(gltf.scene);
        });

    }

    update(time) {




        if (keyboardManager.wasPressed('E')) {


            if (this.open == true) {
                if (this.object.position.z > 28) {    //stop moving 

                    this.open = false;

                }
                else {
                    this.object.position.z += 0.1; //move to the left 

                }
            }
        }

    }


}
