import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { loadingManager } from '../../managers/SceneManager.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class Door extends THREE.Object3D {
    constructor() {
        super();
        this.checkVicinity = false;
        this.doCheckVicinity = false;
        this.object = new THREE.Object3D();


        //subtitles
        this.initialiseSubtitleContents();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);
        
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
            t1: false
        };
        //Checks if the subtitle had been shown already
        this.subtitleState = {
            t1: false
        };
        //Contains the text for each subtitle
        this.subtitleText = {
            t1: "The door's unlocked!!"
        };
    }

    addSubtitles() {
        //t1
        if (!this.subtitleState.t1) {
            subtitleManager.showSubtitles();
            if (!this.subtitleStarted.t1) {
                //start showing the subtitle
                subtitleManager.startTime();
                subtitleManager.setDuration(60);
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

    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }

    setRotation(angle) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    }


    update(time) {
        //just to show the div


        if (this.doCheckVicinity) {
            this.checkVicinity = this.checkCharacterVicinity();
        }

        if (this.open == true) {
            //animate
            if (this.idleMixer) {
                if (this.animationCounter < 80) {
                    //show that the door is unlocked subtitles
                    this.addSubtitles();
                    this.idleMixer.update(this.clock.getDelta());
                    this.animationCounter += 1;
                } else if (this.animationCounter == 80) {
                    //pause the animation mixer-> stop the door from continuing its animation
                    this.idleMixer.paused = true;
                    //display stage complete div
                    const stageComplete = document.getElementById('stageComplete');
                    stageComplete.style.display = 'block';
                }
            }
        }

        if (keyboardManager.wasPressed('E')) {
            if (this.doCheckVicinity) {
                //if character is in vicinity of door, then they can open door
                if (this.checkVicinity) {
                    if (this.open == false) { // animate
                        this.doCheckVicinity = false;

                        //make sure the key prompt doesn't show anymore now that it is open
                        gameOverlay.hideOverlay();
                        //play the door animation
                        this.idle.play();
                        this.idle.loop = THREE.LoopOnce;
                        this.open = true;
                        //checks how long the animation was playing for
                        this.animationCounter = 0;

                        //HIDE KEY IMAGE IN OVERLAY!!! KAMERON!!!


                    }
                }
            }
        }

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
