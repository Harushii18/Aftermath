import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';//checked
//import { loadingManager, mainChar } from '../../managers/SceneManager.js'; // removed cir. ref.
import { gameOverlay } from '../../Overlay/GameOverlay.js';//checked

export class BedroomPainting extends THREE.Object3D {


    constructor(mainChar, loadingManager) {
        super();
        this.mainChar  = mainChar;
        this.loadingManager = loadingManager;
        this.isMoved = false;
        this.object = new THREE.Object3D();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;
        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(this.loadingManager);

        loader.setPath('./models/3DObjects/');

        this.move = false; //keeps track if the painting has moved

        var gltf = loader.load('bedroompainting.glb', (gltf) => {
          //console.log("loaded painting");

           /* gltf.scene.traverse(c => {
                c.castShadow = true;

            });*/


            //scale painting
            this.object.scale.x = 3.5;
            this.object.scale.y = 3.5;
            this.object.scale.z = 3.5;
            this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);


            //move painting
            this.object.position.set(34.5, 12, 45);



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
                gameOverlay.hideOverlay();
            }
        }

        if (this.move == true) {
            if (this.object.position.z < 40) {    //stop moving
                this.move = false;
                this.isMoved = true;
            }
            else {
                this.object.position.z -= 0.1; //move to the left
            }
        }
    }

    inVicinity(vicinityLimitZ, vicinityLimitX){
        let pos = this.mainChar.returnWorldPosition();


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
        //get the position of the main character
        let pos = this.mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 10;
        var vicinityLimitX = 5;

        //if the character is in the vicinity
        if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {
            //display interaction overlay if it isn't being shown
          //  console.log("Player is near the painting");
            if (this.count == 0) {
                if (this.isMoved==false){
                    gameOverlay.changeText('[E] MOVE PAINTING');

                //LATER WE CAN ADD A CONDITION IF HE LOOKED AT IT, HE'LL NOTICE IT CAN MOVE, AND THE
                //INTERACTION WILL SAY MOVE PAINTING
                gameOverlay.showOverlay();
                this.count += 1;
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
