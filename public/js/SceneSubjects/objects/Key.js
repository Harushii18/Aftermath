import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';

export class Key extends THREE.Object3D {


    constructor(loadingManager, mainChar, testdoor) {
        super();

        this.loadingManager = loadingManager;
        this.mainChar = mainChar;
        this.testdoor = testdoor;

        this.object = new THREE.Object3D();
        this.count = 0;
        this.keyType = ""
        this.keyTaken = false;
        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;
        const loader = new GLTFLoader(this.loadingManager);

        loader.setPath('./models/3DObjects/');

        this.open = false;
        this.startInteractions = false;

        var gltf = loader.load('key.glb', (gltf) => {
          //console.log("loaded key");

        /*    gltf.scene.traverse(c => {
                c.castShadow = true;

            });*/



         //   this.object.position.set(20.15, 7.6, 37 );//Perfect

            this.object.add(gltf.scene);
        });

    }

    setKeyType(type){
      this.keyType = type;
    }

    update(time) {
        if (this.open) {
            //since drawer was opened, can interact with key now

            //if key was not taken, show key prompt
            if (!this.keyTaken) {
                var checkVicinity = this.checkCharacterVicinity();
                //on button E press, move drawer
                if (keyboardManager.wasPressed('E')) {
              //  if((keyboardManager.keyDownQueue[0] == "E")){
              //    keyboardManager.keyDownQueue.shift();
                    if (checkVicinity) {

                        this.keyTaken = true;
                        gameOverlay.hideOverlay();
                        //TODO-> DESTROY KEY OBJECT!
                        //just hiding key for now
                        this.object.position.set(0, 100, 0);

                        this.testdoor.setAllowInteraction(true);

                        //These if statements currently don't work
                        if(keyType.localeCompare("drawer")){
                          console.log("This is drawer key");
                        //  testdoor.setAllowInteraction(true);
                        }
                        else if (keyType.localeCompare("study")){
                          console.log("This is study key");
                          //studydoor.updateAllowInteraction();
                        }


                    }
                }

            }

        }
    }
    checkKeyTaken() {
        return this.keyTaken;
    }


    setPosition(posx, posy, posz){
      this.object.position.x = posx;
      this.object.position.y = posy;
      this.object.position.z = posz;
    }

    //checks if Character is in vicinity of drawer to open/ close it
    checkCharacterVicinity() {

        //get the position of the main character
        let pos = this.mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 5;
        var vicinityLimitX = 5;

        //if the character is in the vicinity of the drawer
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {

                gameOverlay.changeText('[E] TAKE KEY');
                gameOverlay.showOverlay();

                this.count += 0.1;

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
