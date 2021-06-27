import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';



export class Crowbar extends THREE.Object3D {

    constructor(loadingManager, mainChar,  hudOverlayAddQueue  ) {
        super();
        this.loadingManager = loadingManager;
        this.mainChar = mainChar;
        this.hudOverlayAddQueue = hudOverlayAddQueue;

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

        //we change this to true when the other events have been allowed
        this.allowInteraction = false;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(this.loadingManager);

        loader.setPath('./models/3DObjects/');


        var gltf = loader.load('crowbar.glb', (gltf) => {
            var obj_gltf = new THREE.Object3D();
            obj_gltf.add(gltf.scene);
            this.object.add(obj_gltf);

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
             t1: "What's a crowbar doing in the bathroom?",
         };
    }

    setAllowInteraction(value) {
        this.allowInteraction = value;
    }

/*<<<<<<< Overlay
    setForScene()
    {
        this.object.rotateY(Math.PI/2);
        this.object.position.set(63.75,2.85,18);
    }

=======*/
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
      //subtitleManager.countTime();
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
              //Hiding crowbar, will need to destroy it later
              this.object.position.set(0, 100, 0);
              this.pickedUp = true;
              //SHOW CROWBAR IMAGE IN OVERLAY


              //add that he found the key
              if (this.objectInteractionCounter != 1)
              {
                //SHOW HAMMER IMAGE IN OVERLAY
                console.log("pushing hammer");
                this.hudOverlayAddQueue.push("crowbar");
              //sceneRemoveQueue.push("key");
                this.objectInteractionCounter += 1;
              }



          }
      }


    }


    setForScene()
    {

        //move crowbar
          this.object.position.set(66.75 , 2.2 , 14.8);
          this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);
        //this.object.position.set(8, 4, 80);

    }

    setForHUD()
    {

      this.object.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI);

        this.object.scale.x = 0.8;
        this.object.scale.y = 0.8;
        this.object.scale.z = 0.8;

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
                gameOverlay.changeText('[E] PICK UP CROWBAR');
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
}
