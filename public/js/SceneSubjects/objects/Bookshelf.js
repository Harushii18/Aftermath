import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar } from '../../managers/SceneManager.js';
import {gameOverlay} from '../../Overlay/GameOverlay.js';

export class Bookshelf extends THREE.Object3D {
    constructor() {
        super();
        this.object = new THREE.Object3D();
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.object.add(cube);
        this.object.scale.x = 2;
        this.object.scale.y = 40;
        this.object.scale.z = 20;
        this.object.position.set(57, 0, -70);

        this.unlocked = false;
        this.complete = false;

        this.clock = new THREE.Clock();

        //LOAD GLTF BOOKSHELF INSTEAD
        /*
                const loader = new GLTFLoader();
        loader.setPath('../../models/');


        var gltf = loader.load('testdoor.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale bookshelf 
            this.object.scale.x = 0.271;
            this.object.scale.y = 0.271;
            this.object.scale.z = 0.271;


            this.object.add(gltf.scene);
        });

        */
    }

    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }

    update(time) {
        //just to show the div
        var checkVicinity=this.checkCharacterVicinity();
        if (keyboardManager.wasPressed('E')) {
            if (this.complete == false) {
                //if character is in vicinity of bookshelf, then they can open bookshelf
                if (checkVicinity) {
                    this.unlocked = true;
                    this.complete = true;
                    //do whatever
                }
            }
        }
        if (this.unlocked) {
            if (this.object.position.z != -50) {
                this.object.position.set(this.object.position.x, this.object.position.y, this.object.position.z + 1);
            } else {
                this.unlocked = false;
            }
        }
    }


    //checks if Character is in vicinity of object to move it
    checkCharacterVicinity() {
        //get the position of the main character
        let pos = mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 20;
        var vicinityLimitX = 10;

        //if the character is in the vicinity of the object
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z - vicinityLimitZ)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            if (this.complete==false){
                gameOverlay.showOverlay();
            }else{
                gameOverlay.hideOverlay();
            }
           
          //  gameOverlay.changeText('[E] Enter code');
            return true;
        }

        
        gameOverlay.hideOverlay();
       
       
        //if the character is not in the vicinity, return false
        return false;
    }

}
