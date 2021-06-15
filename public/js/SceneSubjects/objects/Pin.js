import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar, cupBoardDoorR, bedroomDrawer, hudOverlayAddQueue, sceneRemoveQueue } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class Pin extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();
        this.count = 0;
        this.pickedUp = false;
        this.allowInteraction = false;

        //initialise subtitle contents
        this.initialiseSubtitleContents();

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        var gltf = loader.load('pin.glb', (gltf) => {
          //console.log("loaded pin");
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });


            //rotate pin
          //  this.object.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2*0.5);



            this.object.add(gltf.scene);
        });

    }

    initialiseSubtitleContents() {
        //Checks if the subtitle had started showing
        this.subtitleStarted = {
            t1: false,

        };
        //Checks if the subtitle had been shown already
        this.subtitleState = {
            t1: false,

        };
        //Contains the text for each subtitle
        this.subtitleText = {
            t1: "What could I open with this...?",

        };
    }

    showSubtitlesAfterPickUp(duration) {
        //subtitles that shows when he picks up the hammer
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
                //meaning it was shown
            }
        }
    }

    update(time) {

            //just to show the div
            var checkVicinity = this.checkCharacterVicinity();

            if (this.startSubtitles) {
                this.showSubtitlesAfterPickUp(5);
            }

            //on button E press, move painting to  the left
            if (keyboardManager.wasPressed('E')) {
                if (checkVicinity) {
                  if(this.allowInteraction == true){
                    //Subtitles when lockpick is picked up
                    this.startSubtitles = true;

                    gameOverlay.hideOverlay();
                    //Hiding Lockpick, will need to destroy it later
                    this.object.position.set(0, 100, 0);
                    this.pickedUp = true;
                    
                    //SHOW LOCKPICK IMAGE IN OVERLAY
                    hudOverlayAddQueue.push("pin");
                    //sceneRemoveQueue.push("pin");

                    //Allo bedroomDrawer to be interacted with
                    bedroomDrawer.setAllowInteraction(true);
                  }
                  else{

                  }
                }

            }

    }

    setAllowInteraction(value){
        this.allowInteraction=value;
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
        //  console.log("Vinicinity Lockpick function running");
            //get the position of the main character


            //variable that allows change in vicinity position in which E needs to be pressed:
            var vicinityLimitZ = 5;
            var vicinityLimitX = 5;

            //if the character is in the vicinity
            if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {
              //console.log("Player is near the lockpick");
              //display interaction overlay if it isn't being shown
                if (this.count == 0) {
                    if (this.pickedUp==false){
                      if(this.allowInteraction){


                    gameOverlay.changeText('[E] PICK UP LOCKPICK');

                    gameOverlay.showOverlay();
                    this.count += 1;

                    //HIDE LOCKPICK IMAGE IN OVERLAY
                      }
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

        setForScene()
        {
                      //scale pin
                      this.object.scale.x = 0.5;
                      this.object.scale.y = 0.5;
                      this.object.scale.z = 0.5;
          
                      //move pin
                      this.object.position.set(-12, 6, 84);
          
        }





    }
