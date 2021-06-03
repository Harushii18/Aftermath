import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
export class Hammer extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();
        this.count = 0;
        this.isMoved = false;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.up= true; //hover animation
                    //if hammer should move up or down

        var gltf = loader.load('hammer.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale hammer
            this.object.scale.x = 0.5;
            this.object.scale.y = 0.5;
            this.object.scale.z = 0.5;

            //move hammer
            this.object.position.set(0, 3, 60);

            //rotate hammer
            this.object.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2*0.5);



            this.object.add(gltf.scene);
        });

    }

    update(time) {
        //just to show the div
        var checkVicinity = this.checkCharacterVicinity();

        //on button E press, move painting to  the left
        if (keyboardManager.wasPressed('E')) {
            if (checkVicinity) {
                //this.move = true;

                //SHOW HAMMER IMAGE IN OVERLAY
            }
        }
}


        inVicinity(vicinityLimitZ, vicinityLimitX){
            let pos = mainChar.returnWorldPosition();


            if(pos.x <this.object.position.x +vicinityLimitX && pos.x > this.object.position.x-vicinityLimitX){
              if(pos.z < this.object.position.z+vicinityLimitZ && pos.z > this.object.position.z-vicinityLimitZ){
                return true;
              }
            }
            else{
              return false;
            }
        }

        //checks if Character is in vicinity
        checkCharacterVicinity() {
        //  console.log("Vinicinity Hammer function running");
            //get the position of the main character


            //variable that allows change in vicinity position in which E needs to be pressed:
            var vicinityLimitZ = 5;
            var vicinityLimitX = 5;

            //if the character is in the vicinity
            if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {
              //console.log("Player is near the hammer");
                //display interaction overlay if it isn't being shown
                if (this.count == 0) {
                    if (this.isMoved==false){
                    gameOverlay.changeText('[E] PICK UP HAMMER');

                    //LATER WE CAN ADD A CONDITION IF HE LOOKED AT IT, HE'LL NOTICE IT CAN MOVE, AND THE
                    //INTERACTION WILL SAY MOVE PAINTING
                    gameOverlay.showOverlay();
                    this.count += 1;

                      //HIDE HAMMER IMAGE IN OVERLAY

                    }
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
