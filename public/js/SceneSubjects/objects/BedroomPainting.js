import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { loadingManager, mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
export class BedroomPainting extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;
        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);

        loader.setPath('../../models/3DObjects/');

        this.move = false; //keeps track if the painting has moved 

        var gltf = loader.load('bedroompainting.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale painting 
            this.object.scale.x = 3.5;
            this.object.scale.y = 3.5;
            this.object.scale.z = 3.5;

            
            //move painting
            this.object.position.set(14, 12, 34);



            this.object.add(gltf.scene);
        });

    }

    update(time) {
        //just to show the div
        var checkVicinity = this.checkCharacterVicinity();

        //on button E press, move painting to  the left 
        if (keyboardManager.wasPressed('E')) {
            if (checkVicinity) {
                this.move = true;
            }
        }

        if (this.move == true) {
            if (this.object.position.x < 10) {    //stop moving 
                this.move = false;
            }
            else {
                this.object.position.x -= 0.1; //move to the left 
            }
        }
    }

    //checks if Character is in vicinity 
    checkCharacterVicinity() {
        //get the position of the main character
        let pos = mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 20;
        var vicinityLimitX = 5;

        //if the character is in the vicinity 
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {
                gameOverlay.changeText('[E] LOOK AT PAINTING');

                //LATER WE CAN ADD A CONDITION IF HE LOOKED AT IT, HE'LL NOTICE IT CAN MOVE, AND THE 
                //INTERACTION WILL SAY MOVE PAINTING
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
