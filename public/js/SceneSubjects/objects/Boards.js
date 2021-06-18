import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

//import { loadingManager, mainChar, pin, lockCupboard, hudOverlayRemoveQueue, sceneRemoveQueue, studydoor, crowbar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';
import { Plank } from './Plank.js';

export class Boards extends THREE.Object3D {

  constructor() {
    super();

    this.objectIdentifier = ""
    this.objectInteractionCounter = 0;
    this.object = new THREE.Object3D();
    this.allowInteraction = false;
    this.boardType = "";

    //initialise subtitle contents
    this.initialiseSubtitleContents();

    //variable to start subtitles
    this.showLockedSubtitles = false;
    this.showOpenedSubtitles = false;

    this.clock = new THREE.Clock();
    const loader = new GLTFLoader(loadingManager);
    loader.setPath('../../models/');
    loader.setPath('../../models/3DObjects/');
    this.open = false; //open door animation
    this.count = 0;

    var axis = new THREE.Vector3(0, 0, 1);
    var rad = 0;


    this.startTime = 0;

      this.object = new THREE.Object3D();

      this.plank = new Plank();
      this.plank1 = new Plank();
      this.plank2 = new Plank();


      this.plank.setPosition(0, 5,0);
      this.plank.setRotation(Math.PI / 2)

      this.plank1.setPosition(0, 0, 0);
      this.plank1.setRotation(Math.PI / 2);

      this.plank2.setPosition(0, -5, 0);
      this.plank2.setRotation(Math.PI / 2);

      this.object.add(this.plank.object);
      this.object.add(this.plank1.object);
      this.object.add(this.plank2.object);

      //move door
      //this.object.position.set(-20, -4, 83);

      }

  setBoardType(type){
    this.boardType = type;
  }

  setPosition(posx, posy, posz){

    this.object.position.set(posx, posy, posz);

  }


  setID(objectID){
    //Where is this instance of the object
    this.objectIdentifier = objectID;
    setPosition();
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
      t1: "I wonder if I could pry these boards off with something...",
      t2: "It worked!"
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

    var checkVicinity = this.checkCharacterVicinity();
    if (keyboardManager.wasPressed('E')) {
      if (checkVicinity) {
        if (this.allowInteraction && crowbar.pickedUp) {

          //Animation goes here
          //***********
          //  this.object.rotateOnAxis(new THREE.Vector3(0,1,0), this.object.rotation.y+0.1); // This happens for now
          this.open = true;
          gameOverlay.hideOverlay();
          this.object.visible = false;
          hudOverlayRemoveQueue.push("crowbar");
          this.showOpenedSubtitles = true;
          if (this.boardType=="study"){
            console.log(this.boardType);
            studydoor.setBoardsRemoved();
          }
          else{
            console.log(this.boardType);
            loungedoor.setAllowInteraction(true);
          }


          if (this.objectInteractionCounter != 1) {
            //sceneRemoveQueue.push("lockCupboard");
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



  setAllowInteraction(value) {
      this.allowInteraction = value;
  }



  //checks if Character is in vicinity
  checkCharacterVicinity() {
    //variable that allows change in vicinity position in which E needs to be pressed:
    var vicinityLimitZ = 10;
    var vicinityLimitX = 10;

    //if the character is in the vicinity
    if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {

      //  console.log("Player is near the Cupboard");
      //display interaction overlay if it isn't being shown
      if (this.count == 0) {
        if (this.open == false) {
          gameOverlay.changeText('[E] BREAK BOARDS');
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
