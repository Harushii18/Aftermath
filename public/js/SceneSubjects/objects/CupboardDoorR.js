import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { loadingManager, mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
export class CupboardDoorR extends THREE.Object3D {

    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);
        loader.setPath('../../models/');
        loader.setPath('../../models/3DObjects/');
        this.open = false; //open door animation
        this.count = 0;
        var axis = new THREE.Vector3(0, 0, 1);
        var rad=0;

        this.startTime = 0;

        var gltf = loader.load('cupboardDoorR.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });



            // //scale door
            this.object.scale.x = 0.8;
            this.object.scale.y = 0.8;
            this.object.scale.z = 0.8;

            //move door
            this.object.position.set(-12.5, -5, 66.3);





            this.object.add(gltf.scene);
        });

    }






    update(time) {
      

      var rotationVector = new THREE.Vector3(0,1,0);
      //rotationVector.x = rotationVector.x + this.object.position.x;
      //rotationVector.y = rotationVector.y + this.object.position.y;

      rotationVector.normalize();
      this.object.rotateOnAxis(rotationVector,0.01*(Math.sin(time) + 1.5) / 2);
        //just to show the div
        var checkVicinity = this.checkCharacterVicinity();

        //on button E press, move painting to  the left
        if (keyboardManager.wasPressed('E')) {
            if (checkVicinity) {
              this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this.object.rotation.y+0.1);
              this.open = true;
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
        var vicinityLimitZ = 10;
        var vicinityLimitX = 5;

        //if the character is in the vicinity
        if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {

        //  console.log("Player is near the Cupboard");
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {
                if (this.open==false){
                gameOverlay.changeText('[E] OPEN CUPBOARD');
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
