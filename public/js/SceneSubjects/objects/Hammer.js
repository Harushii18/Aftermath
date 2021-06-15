import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar, cupBoardDoorR, hudOverlayAddQueue } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class Hammer extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();
        this.count = 0;
        this.pickedUp = false;

        //initialise subtitle contents
        this.initialiseSubtitleContents();

        //Variables to start subtitles
        this.startSubtitles = false;



        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.up= true; //hover animation
                    //if hammer should move up or down

        var gltf = loader.load('hammer.glb', (gltf) => {
          //console.log("loaded hammer");
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });




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
            t1: "A hammer? Not my weapon of choice, but I could do some damage...",

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
            this.showSubtitlesAfterPickUp(80);
        }


        if (keyboardManager.wasPressed('E')) {
            if (checkVicinity) {
              //Subtitles when hammer is picked up
                this.startSubtitles = true;

                gameOverlay.hideOverlay();
                //Hiding Hammer, will need to destroy it later
                this.object.position.set(0, 100, 0);
                this.pickedUp = true;

                //SHOW HAMMER IMAGE IN OVERLAY
                hudOverlayAddQueue.push("hammer");

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
            var vicinityLimitX = 10;

            //if the character is in the vicinity
            if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {
              //console.log("Player is near the hammer");
                //display interaction overlay if it isn't being shown
                if (this.count == 0) {
                    if (this.pickedUp==false){
                    gameOverlay.changeText('[E] PICK UP HAMMER');

                    //LATER WE CAN ADD A CONDITION IF HE LOOKED AT IT, HE'LL NOTICE IT CAN MOVE, AND THE
                    //INTERACTION WILL SAY MOVE PAINTING
                    gameOverlay.showOverlay();
                    this.count += 1;
                    cupBoardDoorR.setAllowInteraction(true);
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

        isPickedUp(){
          return this.pickedUp;
        }


        setForScene()
        {
            //scale hammer
            this.object.scale.x = 0.5;
            this.object.scale.y = 0.5;
            this.object.scale.z = 0.5;
            
            //move hammer
            this.object.position.set(7, 2.4, 80);
            
            //rotate hammer
            this.object.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2*0.5);
        }


    }
