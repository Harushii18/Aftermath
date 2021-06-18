import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { loadingManager, mainChar, hudOverlayRemoveQueue, hudOverlayAddQueue, loungeBoards, studyBoards, microwave  } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';



export class LightSwitch extends THREE.Object3D {


    constructor() {
        super();
        this.objectInteractionCounter = 0;
        this.object = new THREE.Object3D();

        //initialise subtitle contents
        this.initialiseSubtitleContents();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;
        this.pickedUp = false;

        //variable to start subtitles
        this.startSubtitles = false;
        this.showPickUpSubtitles = false;

        this.object.position.set(-22.9 , 12.45 , -24.95);
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

        //we change this to true when the other events have been allowed
        this.allowInteraction = false;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);

        loader.setPath('../../models/3DObjects/');


        var gltf = loader.load('switch.glb', (gltf) => {
            //console.log("loaded drawer");
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            this.object.add(gltf.scene);
        });

    }

    initialiseSubtitleContents() {
    //  console.log("Initialise Subtitle Contents Crowbar");
        //Checks if the subtitle had started showing
        this.subtitleStarted = {
            t1: false,
        };
        //Checks if the subtitle had been shown already
        this.subtitleState = {
            t1: false,
          };
        // //Contains the text for each subtitle
         this.subtitleText = {
             t1: "The power is back.",
         };
    }

    setAllowInteraction(value) {
        this.allowInteraction = value;
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
          this.showSubtitlesAfterPickUp(7);
      }

      if (keyboardManager.wasPressed('E')) {
          if (checkVicinity) {
            //Subtitles when crowbar is picked up
              this.startSubtitles = true;

              gameOverlay.hideOverlay();
              this.pickedUp = true;
              microwave.setAllowInteraction(true);

              //SHOW CROWBAR IMAGE IN OVERLAY
              //hudOverlayAddQueue.push("crowbar");

          }
      }


    }




    //checks if Character is in vicinity
    checkCharacterVicinity() {
      //console.log("Vinicinity Crowbar function running");
        //get the position of the main character


        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 8;
        var vicinityLimitX = 8;

        //if the character is in the vicinity

        //console.log(this.inVicinity(vicinityLimitZ, vicinityLimitX));
        if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {
          //console.log("Player is near the crowbar");
          //console.log("Player is near the hammer");
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {
                if (this.pickedUp==false){
                gameOverlay.changeText('[E] TURN ON POWER');
                loungeBoards.setAllowInteraction(true);
                studyBoards.setAllowInteraction(true);

                //LATER WE CAN ADD A CONDITION IF HE LOOKED AT IT, HE'LL NOTICE IT CAN MOVE, AND THE
                //INTERACTION WILL SAY MOVE PAINTING
                gameOverlay.showOverlay();
                this.count += 1;
                //cupBoardDoorR.setAllowInteraction(true);
                //HIDE HAMMER IMAGE IN OVERLAY

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
        this.object.scale.x = 4;
        this.object.scale.y = 4;
        this.object.scale.z = 4;
        this.object.position.set(-70 , 12.45 , -24.95);
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

    }

}



