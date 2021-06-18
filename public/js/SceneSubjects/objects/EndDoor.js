import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { loadingManager, mainChar} from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class EndDoor extends THREE.Object3D {

  constructor(loadingManager, mainChar) {
    super();

    this.loadingManager = loadingManager;
    this.mainChar = mainChar;



    this.objectInteractionCounter = 0;
    this.object = new THREE.Object3D();
    this.allowInteraction = false;
    this.hasKey = false;
    this.boardsRemoved = false;



    //variable to start subtitles
    this.showLockedSubtitles = false;
    this.showOpenedSubtitles = false;

    this.clock = new THREE.Clock();
    const loader = new GLTFLoader(this.loadingManager);
    loader.setPath('../../models/');
    loader.setPath('../../models/3DObjects/');
    this.open = false; //open door animation
    this.count = 0;

    var axis = new THREE.Vector3(0, 0, 1);
    var rad = 0;


    this.startTime = 0;

    var gltf = loader.load('testdoor.glb', (gltf) => {
      //console.log("loaded cupboard door");
      gltf.scene.traverse(c => {
        c.castShadow = true;

      });

      //scale door
      this.object.scale.x = 0.271;
      this.object.scale.y = 0.271;
      this.object.scale.z = 0.271;



      //move door
      //this.object.position.set(-20, -4, 83);



      this.object.add(gltf.scene);
    });
  }

  setPosition(x, y, z) {
       this.object.position.set(x, y, z);
   }

   setRotation(angle) {
       this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
   }


  update(time) {

    this.delta = this.clock.getDelta();
    //pause the cupboard animation at the right moment

    var checkVicinity = this.checkCharacterVicinity();
    if (keyboardManager.wasPressed('E')) {


      if (checkVicinity) {
        if (this.allowInteraction) {

          this.open = true;
          gameOverlay.hideOverlay();
          console.log("End Game");
          //MAKE CREDITS START HERE


        }
        else {

        }

      }

    }

  }



  setAllowInteraction(value){
    this.allowInteraction = value;
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



  setOpenedBookshelf() {
    this.openedBookshelf = true;
    //console.log(this.allowInteraction);
  }

  setBoardsRemoved() {
    this.boardsRemoved = true;
    //console.log(this.allowInteraction);
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
          gameOverlay.changeText('[E] LEAVE THE HOUSE');
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


  isOpen() {
    return this.open;
  }

  return3DObject() {
    return this.object;
  }

}
