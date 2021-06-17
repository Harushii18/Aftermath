import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { loadingManager } from '../../managers/SceneManager.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class WoodenDoor extends THREE.Object3D {
    constructor() {
        super();
        this.objectInteractionCounter = 0;
        this.playDoorSound = false;
        this.doCheckVicinity = false;
        this.object = new THREE.Object3D();
        this.allowInteraction = false;
        this.clock = new THREE.Clock();



        //subtitles
        this.initialiseSubtitleContents();
        //variable to start subtitles
        this.showLockedSubtitles = false;


        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);
        this.showUnlockedSubs = false;

        this.open = false; //open door animation

        this.startTime = 0;

        loader.setPath('../../models/3DObjects/');
        var gltf = loader.load('testdoor.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale door
            this.object.scale.x = 0.271;
            this.object.scale.y = 0.271;
            this.object.scale.z = 0.271;

            //play animation
            this.idleMixer = new THREE.AnimationMixer(gltf.scene);
            this.idleMixer.timeScale = 0.08; //speed of animation
            this.idle = this.idleMixer.clipAction(gltf.animations[0]);
            this.idle.clampWhenFinished = true;

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
            t1: "The door's unlocked!!",
            t2: "It's locked..."
        };
    }

    addSubtitles() {
        //t1
        if (!this.subtitleState.t1) {
            subtitleManager.showSubtitles();
            if (!this.subtitleStarted.t1) {
                //start showing the subtitle
                subtitleManager.startTime();
                subtitleManager.setDuration(5);
                subtitleManager.changeSubtitlesText(this.subtitleText.t1);
                this.subtitleStarted.t1 = true;
                //display stage complete div
                const stageComplete = document.getElementById('stageComplete');
                stageComplete.style.display = 'block';
            }

            subtitleManager.countTime();
            if (!subtitleManager.checkTime()) {
                this.subtitleState.t1 = true;
                this.showUnlockedSubs = false;
                //meaning it was shown
            }
        }
    }

    showSubtitlesLocked(duration) {
        //subtitles that need to be shown if he has the key
        if (!this.showLockedSubtitles.t2) {
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
                this.showLockedSubtitles = false;
                //meaning it was shown
            }
        }

    }


    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }

    setRotation(angle) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    }


    setAllowInteraction(value) {
        this.allowInteraction = value;
    }

    update(time) {
        //just to show the div

        this.delta = this.clock.getDelta();
        if (this.doCheckVicinity) {
            this.checkVicinity = this.checkCharacterVicinity();
        }


        if (this.showLockedSubtitles) {
            this.showSubtitlesLocked(5);
        } else if (this.showUnlockedSubs) {
            this.addSubtitles();
        }

        if (this.open == true) {
            this.showLockedSubtitles = false;

            //animate
            if (this.idleMixer) {
                if (this.animationCounter < 2) {
                    this.idleMixer.update(this.delta);
                    this.animationCounter += (1 * this.delta);
                } else if (this.animationCounter > 2) {
                    //pause the animation mixer-> stop the door from continuing its animation
                    this.idleMixer.paused = true;

                }
            }
        }

        if (keyboardManager.wasPressed('E')) {
               // console.log("e pressed by door");

            if (this.checkVicinity) {
               // console.log("vicinity by door");
                //if character is in vicinity of door, then they can open door
                if (this.allowInteraction) {
                    this.playDoorSound = true;
                    //show that the door is unlocked subtitles
                    this.showUnlockedSubs = true;
                    this.showLockedSubtitles = false;
                    //make sure the key prompt doesn't show anymore now that it is open
                    gameOverlay.hideOverlay();
                    //play the door animation
                    this.idle.play();
                    this.idle.loop = THREE.LoopOnce;
                    this.open = true;
                    //checks how long the animation was playing for
                    this.animationCounter = 0;

                        //console.log("door allow interaction true. now set to false");

                    /*                        WhatsApp
                                                                             
                    //Suraksha: HIDE KEY IMAGE IN OVERLAY!!! KAMERON!!!         (double blue tick)
                    //Kameron: THATSSSS MA NAME!!!                              (double blue tick)
                    //Suraksha: THANK YOU!!!!!!                                 (single tick)

                    */


                    this.allowInteraction = false;
                    this.objectInteractionCounter += 1;

                }
                else {
                    if (this.objectInteractionCounter == 0) {
                        this.playDoorSound = false;

                        this.showLockedSubtitles = true;
                        this.subtitleState.t2 = false;
                        this.subtitleStarted.t2 = false;
                    }

                }
            }
        }
    }



    level1Complete() {
        return this.open;
    }

    //checks if Character is in vicinity of door to open/ close it
    checkCharacterVicinity() {
        //get the position of the main character
        let pos = mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ = 10;
        var vicinityLimitX = 5;

        //if the character is in the vicinity of the door
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z - vicinityLimitZ)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            //display interaction overlay if it isn't being shown
            if (this.count == 0) {
                if (this.open == false) {
                    gameOverlay.changeText('[E] OPEN DOOR');
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


    return3DObject() {
        return this.object;
    }

}
