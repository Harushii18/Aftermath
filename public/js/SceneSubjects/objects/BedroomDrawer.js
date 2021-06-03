import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';

export class BedroomDrawer extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.open = false; //keeps track if the drawer is openend 

        var gltf = loader.load('bedroomDrawer.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            // //scale drawer
            this.object.scale.x = 7;
            this.object.scale.y = 7;
            this.object.scale.z = 7;

            //move drawer
            this.object.position.set(13.6, 1.7, 26.1);



            this.object.add(gltf.scene);
        });

    }

    update(time) {
        //just to show the div
        var checkVicinity = this.checkCharacterVicinity();


        //on button E press, move drawer
        if (keyboardManager.wasPressed('E')) {
            if (checkVicinity) {
                this.open = true;
            }

        }

        if (this.open == true) {
            if (this.object.position.z > 28) {    //stop moving 

                this.open = false;

            }
            else {
                this.object.position.z += 0.1; //move to the left 

            }
        }

    }

    //checks if Character is in vicinity of drawer to open/ close it
    checkCharacterVicinity() {
        //get the position of the main character
        let pos = mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 20;
        var vicinityLimitX = 5;

        //if the character is in the vicinity of the drawer
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {
                gameOverlay.changeText('[E] OPEN DRAWER');
                gameOverlay.showOverlay();
                this.count += 1;
            }
            return true;
        }
        //if the character is not in the vicinity, return false
        //hide interaction overlay
        if (this.count == 1) {
            gameOverlay.hideOverlay();
            this.count = 0;
        }

        return false;
    }

}
