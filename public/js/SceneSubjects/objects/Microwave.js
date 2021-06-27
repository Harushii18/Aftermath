import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class Microwave extends THREE.Object3D {

  constructor(loadingManager, mainChar, studydoor, hudOverlayAddQueue) {
    super();

    this.loadingManager = loadingManager;
    this.mainChar = mainChar;
    this.studydoor = studydoor;
    this.hudOverlayAddQueue = hudOverlayAddQueue;

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
    loader.setPath('./models/3DObjects/');
    this.open = false; //open door animation
    this.count = 0;

    //animation
    this.animationCounter = 0;

    var axis = new THREE.Vector3(0, 0, 1);
    var rad = 0;


    this.startTime = 0;

    var gltf = loader.load('microwave.glb', (gltf) => {
      //console.log("loaded cupboard door");
      // gltf.scene.traverse(c => {
      //   c.castShadow = true;

      // });

      this.object.scale.x = 1.2;
      this.object.scale.y = 1.2;
      this.object.scale.z = 1.2;

      //this.object.position.set(-44,10, 25.7); //(x,y,z)
      this.object.position.set(-48.2, 9.55, 24.55);

      this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);

      //move door
      //this.object.position.set(-20, -4, 83);

      //get animation for microwave
      this.microMixer = new THREE.AnimationMixer(gltf.scene);
      this.microMixer.timeScale = 2; //speed of animation
      this.microAnim = this.microMixer.clipAction(gltf.animations[0]);



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
      t1: "It's locked?? Since when do I need power to open a microwave!?",
      t2: "Another key..."
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
    //pause the cupboard animation at the right moment
    if (this.microMixer && this.open) {
      if (this.animationCounter < (1)) {
        this.microMixer.update(this.delta);
        this.animationCounter += (1 * this.delta);
      } else if (this.animationCounter > 1) {
        //pause the animation mixer-> stop the cupboard from continuing its animation
        this.microMixer.paused = true;
      }
    }
    var checkVicinity = this.checkCharacterVicinity();
    if (keyboardManager.wasPressed('E')) {


      if (checkVicinity) {
        if (this.allowInteraction && this.open == false) {

          //Animation goes here
          this.microAnim.play();
          //***********
          //  this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this.object.rotation.y+0.1); // This happens for now
          this.open = true;
          gameOverlay.hideOverlay();
          this.showOpenedSubtitles = true;
          //SHOW KEY IMAGE IN OVERLAY
          this.hudOverlayAddQueue.push("studykey");
          this.studydoor.setHasKey();


          if (this.objectInteractionCounter != 1) {
            //sceneRemoveQueue.push("lockCupboard");
            this.objectInteractionCounter += 1;
          }
          //lockCupboard.setPosition(new THREE.Vector3(0,100,0));
          this.allowInteraction = false;
        }
        else {
          if (this.open == false) {
            this.showLockedSubtitles = true;
            this.subtitleState.t1 = false;
            this.subtitleStarted.t1 = false;
          }
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
    var vicinityLimitX = 10;

    //if the character is in the vicinity
    if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {

      //  console.log("Player is near the Cupboard");
      //display interaction overlay if it isn't being shown
      if (this.count == 0) {
        if (this.open == false) {
          gameOverlay.changeText('[E] OPEN MICROWAVE');
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
