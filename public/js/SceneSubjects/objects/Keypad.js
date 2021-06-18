import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';


//import { loadingManager, mainChar, hudOverlayRemoveQueue, bookshelf } from '../../managers/SceneManager.js';

import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';


export class Keypad extends THREE.Object3D {


    constructor(mainChar,loadingManager,bookshelf,endDoor) {
        super();
        this.mainChar = mainChar;
        this.endDoor = endDoor;
        this.loadingManager = loadingManager;
        this.bookshelf = bookshelf;
        this.objectInteractionCounter = 0;
        this.object = new THREE.Object3D();
        this.animateKeypad = false;


        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;


        this.doCheckVicinity = true;
        //we change this to true when the other events have been allowed
        this.allowInteraction = true;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(this.loadingManager);

        loader.setPath('../../models/3DObjects/');

        this.open = false; //keeps track if the drawer is openend




        var gltf = loader.load('keypad.glb', (gltf) => {
            //console.log("loaded drawer");
            // gltf.scene.traverse(c => {
            //     c.castShadow = true;

            // });



            var obj_gltf = new THREE.Object3D();






            obj_gltf.add(gltf.scene);
            this.object.add(obj_gltf);
        });

    }


    inVicinity(vicinityLimitZ, vicinityLimitX) {
      let pos = this.mainChar.returnWorldPosition();


      if (pos.x < this.object.position.x + vicinityLimitX && pos.x > this.object.position.x - vicinityLimitX) {
        if (pos.z < this.object.position.z + vicinityLimitZ && pos.z > this.object.position.z - vicinityLimitZ) {
          return true;
        }
      }
      else {
        return false;
      }
    }



    setAllowInteraction(value) {
      this.allowInteraction = value;
    }


    //checks if Character is in vicinity
    checkCharacterVicinity() {
      //  console.log("Vinicinity Hammer function running");
      //get the position of the main character


      //variable that allows change in vicinity position in which E needs to be pressed:
      var vicinityLimitZ = 10;
      var vicinityLimitX = 10;

      //if the character is in the vicinity
      if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {

        //  console.log("Player is near the Cupboard");
        //display interaction overlay if it isn't being shown
        if (this.count == 0) {
          if (this.open == false) {
            gameOverlay.changeText('[E] ENTER CODE');
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


    update(time) {
      if(this.animateKeypad){
        if(this.object.position.z<-33.7 ){
          this.object.position.z+=(this.delta*5);
        }
        else{
          this.animateKeypad = false;
        }
      }


      this.delta = this.clock.getDelta();
      //pause the cupboard animation at the right moment

      var checkVicinity = this.checkCharacterVicinity();
      if (keyboardManager.wasPressed('E')) {


        if (checkVicinity) {
          if (this.allowInteraction) {

            //Animation goes here
            //***********
            //  this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this.object.rotation.y+0.1); // This happens for now
            this.open = true;
            gameOverlay.hideOverlay();
            this.showOpenedSubtitles = true;

            //Animate Keypad and Bookshelf
            this.animateKeypad = true;

            this.bookshelf.animateBookshelf = true;
            this.endDoor.setAllowInteraction(true);


            //lockCupboard.setPosition(new THREE.Vector3(0,100,0));
            this.allowInteraction = false;
          }
          else {


          }

        }

      }


    }



    setForScene()
    {

        this.object.scale.x = 1.5;
        this.object.scale.y = 1.5;
        this.object.scale.z = 1.5;

        this.object.position.set(54.7 , 15.05 , -54.2);
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI);
    }

}
