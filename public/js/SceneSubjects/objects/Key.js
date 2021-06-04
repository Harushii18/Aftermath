import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { loadingManager, mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { bedroomDrawer } from '../../managers/SceneManager.js';

export class Key extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        this.count = 0;

        this.keyTaken = false;
        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;
        const loader = new GLTFLoader(loadingManager);

        loader.setPath('../../models/3DObjects/');

        this.open = false;
        this.startInteractions = false;

        var gltf = loader.load('key.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            this.object.scale.x = 0.4;
            this.object.scale.y = 0.4;
            this.object.scale.z = 0.4;

            //set object's position
            //this.object.position.set(-12, 9, 64);;
            this.object.position.set(20.15, 7.6, 37 );//Perfect


            this.object.add(gltf.scene);
        });

    }

    update(time) {

        if (bedroomDrawer.isKeyFound()) {
        //  console.log("Bedroom Drawer is Opened");
          if (this.open == false) {
          //  console.log("Key anim not played");
              if (this.object.position.z > 39) {    //stop moving
                  this.open = true;
              }
              else {
              //  console.log("Key anim playing");
                  this.object.position.z += 0.5; //move to the left
              }
          }
        }


        if (this.open) {
            //since drawer was opened, can interact with key now

            //if key was not taken, show key prompt
            if (!this.keyTaken) {
                var checkVicinity = this.checkCharacterVicinity();
                //on button E press, move drawer
                if (keyboardManager.wasPressed('E')) {
                    if (checkVicinity) {

                        this.keyTaken = true;
                        gameOverlay.hideOverlay();
                        //TODO-> DESTROY KEY OBJECT!
                        //just hiding key for now
                        this.object.position.set(0, 100, 0);

                        //DISPLAY KEY IN OVERLAY!!!
                        //KAMERON!

                    }
                }

            }

        }
    }
    checkKeyTaken() {
        return this.keyTaken;
    }


    //checks if Character is in vicinity of drawer to open/ close it
    checkCharacterVicinity() {

        //get the position of the main character
        let pos = mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 5;
        var vicinityLimitX = 5;

        //if the character is in the vicinity of the drawer
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {

                gameOverlay.changeText('[E] TAKE KEY');
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
