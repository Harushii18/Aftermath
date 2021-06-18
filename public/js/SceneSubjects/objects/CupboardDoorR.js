import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js'; //checked
//import { loadingManager, mainChar, pin, hudOverlayRemoveQueue, sceneRemoveQueue } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';//checked
import { subtitleManager } from '../../managers/SubtitleManager.js';//checked

export class cupboardDoorR extends THREE.Object3D {

  constructor(mainChar, loadingManager, pin, hudOverlayRemoveQueue,sceneRemoveQueue) {
    super();

    this.mainChar = mainChar;
    this.loadingManger = loadingManager;
    this.pin = pin;
    this.hudOverlayRemoveQueue = hudOverlayRemoveQueue;
    this.sceneRemoveQueue = sceneRemoveQueue;

    this.objectInteractionCounter = 0;
    this.object = new THREE.Object3D();
    this.allowInteraction = false;

    //initialise subtitle contents
    this.initialiseSubtitleContents();

    //variable to start subtitles
    this.showLockedSubtitles = false;
    this.showOpenedSubtitles = false;

    this.clock = new THREE.Clock();
    const loader = new GLTFLoader(this.loadingManager);
    loader.setPath('../../models/');
    loader.setPath('../../models/3DObjects/');
    this.open = false; //open door animation
    this.count = 0;
    this.animationCounter = 0;
    var axis = new THREE.Vector3(0, 0, 1);
    var rad = 0;


    this.startTime = 0;

    var gltf = loader.load('cupboard.glb', (gltf) => {
      //console.log("loaded cupboard door");

   /*   gltf.scene.traverse(c => {
        c.castShadow = true;

      });*/


      // //scale door
      this.object.scale.x = 3;
      this.object.scale.y = 3;
      this.object.scale.z = 3;

      //move door
      this.object.position.set(-20, -4, 83);
      //this.object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI);


      //get animation for cupboard
      this.cupboardMixer = new THREE.AnimationMixer(gltf.scene);
      this.cupboardMixer.timeScale = 5; //speed of animation
      this.cupboardAnim = this.cupboardMixer.clipAction(gltf.animations[0]);

      this.object.add(gltf.scene);
    });
  }


  initialiseSubtitleContents() {
    //Checks if the subtitle had started showing
    this.subtitleStarted = {
      t1: false,
      t2: false
    };
    //Checks if the subtitle had been shown already
    this.subtitleState = {
      t1: false,
      t2: false
    };
    //Contains the text for each subtitle
    this.subtitleText = {
      t1: "It's locked! I don't remember locking this?!",
      t2: "Finally, it's opened!"
    };
  }


  showSubtitlesLocked(duration) {
    //subtitles that show if he doesn't have the key
    //t1
    if (!this.subtitleState.t1) {
      subtitleManager.showSubtitles();
      if (!this.subtitleStarted.t1) {
        //start showing the subtitle
        subtitleManager.startTime();
        subtitleManager.setDuration(duration);
        subtitleManager.changeSubtitlesText(this.subtitleText.t1);
        this.subtitleStarted.t1 = true;
      }

      subtitleManager.countTime();
      if (!subtitleManager.checkTime()) {
        this.subtitleState.t1 = true;
        this.showLockedSubtitles = false;
        //meaning it was shown
      }
    }
  }
  showSubtitlesUnlocked(duration) {
    //subtitles that need to be shown if he has the key
    if (!this.showOpenedSubtitles.t2) {
      subtitleManager.showSubtitles();
      if (!this.subtitleStarted.t2) {
        //start showing the subtitle
        subtitleManager.startTime();
        subtitleManager.setDuration(duration);
        subtitleManager.changeSubtitlesText(this.subtitleText.t2);
        this.subtitleStarted.t2 = true;
      }

      subtitleManager.countTime();
      if (!subtitleManager.checkTime()) {
        this.subtitleState.t2 = true;
        this.showOpenedSubtitles = false;
        //meaning it was shown
      }
    }

  }



  update(time) {

    if (this.showLockedSubtitles) {
      this.showSubtitlesLocked(5);
    }
    if (this.showOpenedSubtitles) {
      this.showSubtitlesUnlocked(5);
    }

    this.delta = this.clock.getDelta();
    //pause the cupboard animation at the right moment
    if (this.cupboardMixer && this.open) {
      if (this.animationCounter < (1)) {
        this.cupboardMixer.update(this.delta);
        this.animationCounter += (1 * this.delta);
      } else if (this.animationCounter > 1) {
        //pause the animation mixer-> stop the cupboard from continuing its animation
        this.cupboardMixer.paused = true;

      }
    }

    var checkVicinity = this.checkCharacterVicinity();

    if (keyboardManager.wasPressed('E')) {
      if (checkVicinity) {
        if (this.allowInteraction) {

          //Animation goes here
          //***********
          //  this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this.object.rotation.y+0.1); // This happens for now
          this.open = true;
          gameOverlay.hideOverlay();
          this.pin.setAllowInteraction(true);
          this.showOpenedSubtitles = true;
          //play the cupboard animation
          this.cupboardAnim.play();
        //  this.cupboardAnim.loop = THREE.LoopRepeat;
          //this variable is to ensure that we can stop the animation at a specific time
          this.animationCounter = 0;

          if (this.objectInteractionCounter != 1) {
            this.hudOverlayRemoveQueue.push("hammer");
            this.sceneRemoveQueue.push("lockCupboard");
            this.objectInteractionCounter += 1;
          }
          //lockCupboard.setPosition(new THREE.Vector3(0,100,0));
        }
        else {
          this.showLockedSubtitles = true;
          this.subtitleState.t1 = false;
          this.subtitleStarted.t1 = false;
        }

      }

    }

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



  isOpen() {
    return this.open;
  }

  return3DObject() {
    return this.object;
  }

}
