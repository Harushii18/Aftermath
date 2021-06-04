import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { loadingManager, mainChar, hammer, pin } from '../../managers/SceneManager.js';
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
    this.animationCounter = 0;
    var axis = new THREE.Vector3(0, 0, 1);
    var rad = 0;


    this.startTime = 0;

    var gltf = loader.load('cupboard.glb', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;

      });

      // //scale door
      this.object.scale.x = 3;
      this.object.scale.y = 3;
      this.object.scale.z = 3;

      //move door
      this.object.position.set(-20, -4, 83);
      //this.object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI);


      //get animation for cupboard 
      this.cupboardMixer = new THREE.AnimationMixer(gltf.scene);
      this.cupboardMixer.timeScale = 0.2; //speed of animation
      this.cupboardAnim = this.cupboardMixer.clipAction(gltf.animations[0]);

      this.object.add(gltf.scene);
    });
  }






  update(time) {
 
    //pause the cupboard animation at the right moment
    if (this.cupboardMixer) {
      if (this.animationCounter < 20) {
        this.cupboardMixer.update(this.clock.getDelta());
        this.animationCounter += 1;
      } else if (this.animationCounter == 20) {
        //pause the animation mixer-> stop the cupboard from continuing its animation
        this.cupboardMixer.paused = true;
      }
    }
    if (hammer.isPickedUp()) {

      /*var rotationVector = new THREE.Vector3(0,1,0);
      rotationVector.normalize();
      this.object.rotateOnAxis(rotationVector,0.01*(Math.sin(time) + 1.5) / 2);
      */
      //just to show the div
      var checkVicinity = this.checkCharacterVicinity();

      //on button E press, move painting to  the left
      if (keyboardManager.wasPressed('E')) {
        if (checkVicinity) {
          //play the cupboard animation
          this.cupboardAnim.play();
          this.cupboardAnim.loop = THREE.LoopRepeat;

          //this variable is to ensure that we can stop the animation at a specific time
          this.animationCounter = 0;

          // this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this.object.rotation.y+0.1); // This happens for now
          this.open = true;

          pin.setAllowInteraction(true);

        }
      }
    }
  }



  inVicinity(vicinityLimitZ, vicinityLimitX) {
    let pos = mainChar.returnWorldPosition();


    if (pos.x < this.object.position.x + vicinityLimitX && pos.x > this.object.position.x - vicinityLimitX) {
      if (pos.z < this.object.position.z + vicinityLimitZ && pos.z > this.object.position.z - vicinityLimitZ) {
        return true;
      }
    }
    else {
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
        if (this.open == false) {
          gameOverlay.changeText('[E] OPEN CUPBOARD');
          //LATER WE CAN ADD A CONDITION IF HE LOOKED AT IT, HE'LL NOTICE IT CAN MOVE, AND THE
          //INTERACTION WILL SAY MOVE PAINTING
          gameOverlay.showOverlay();
          this.count += 1;
        }
      }
      return true;
    }
    //if the character is notwwww in the vicinity, return false
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

}
