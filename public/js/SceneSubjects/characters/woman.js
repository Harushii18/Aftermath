import * as THREE from '../../../jsm/three.module.js';
import { FBXLoader } from '../../../jsm/FBXLoader/FBXLoader.js';
import { loadingManager, mainChar, testdoor } from '../../managers/SceneManager.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';
import { characterControls } from '../../managers/CharacterControls.js';
export class Woman extends THREE.Object3D {
    constructor() {
        super();

        //woman object
        this.object = new THREE.Object3D();
        this.object.position.set(0, 0, -15);
        this.womanVisible = false;
        this.object.visible=false;
        this.startSubs = false;

        this.clock = new THREE.Clock();


        //scale to correct size
        this.object.scale.x = 9;
        this.object.scale.y = 9;
        this.object.scale.z = 9;
        this.loadModel();
        this.initialiseSubtitleContents();


        this.update = function (time) {
            //IF LEVEL 1 IS COMPLETE ONLY!
            if (this.getLevel1Complete()) {
                //ensure that all movement is not by frame rate
                this.delta = this.clock.getDelta();


                //animation
                if (this.walkMixer) {
                    this.walkMixer.update(this.delta);
                }

                //INITIAL INTERACTION WITH WOMAN===================

                if (this.checkCharacterVicinity()) {
                    this.startSubs = true;
                }
                if (this.startSubs) {
                    if (this.subtitleState.t2 == false) {
                        this.subtitle1();

                        //if first subs been shown
                        if (this.subtitleState.t1) {
                            this.subtitle2();
                        }
                    }

                }
                //=====================================


            }

        };
    }
    return3DObject() {
        return this.object;
    }

    inVicinity(vicinityLimitZ, vicinityLimitX) {
        //get the position of the main character
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

    getLevel1Complete() {
        //IF LEVEL 1 IS COMPLETE!
        this.level1Complete = testdoor.level1Complete(); //if you want to test from lvl2 , make it true

        if (this.level1Complete) {
            if (!this.womanVisible) {
                //show the woman now that the door has opened
                this.object.visible = true;
                this.womanVisible = true;

                //so the character walks really slowly towards the woman
                characterControls.setSpeed(2);
            }
            return true;
        }
        else {
            return false;
        }
    }
    //checks if Character is in vicinity
    checkCharacterVicinity() {

        var vicinityLimitZ = 50;
        var vicinityLimitX = 5;

        //check how close the character is to the woman-> death limit
        if (this.inVicinity(vicinityLimitZ, vicinityLimitX)) {

            return true;
        }

        return false;
    }



    //====================SUBTITLES========================================
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
            t1: "Hello??",
            t2: "What the hell? It disappeared!"
        };
    }

    subtitle1() {

        //t1
        if (!this.subtitleState.t1) {
            subtitleManager.showSubtitles();
            if (!this.subtitleStarted.t1) {
                //start showing the subtitle
                subtitleManager.startTime();
                subtitleManager.setDuration(2);
                subtitleManager.changeSubtitlesText(this.subtitleText.t1);
                this.subtitleStarted.t1 = true;
            }

            subtitleManager.countTime();
            if (!subtitleManager.checkTime()) {
                //meaning it was shown
                this.subtitleState.t1 = true;
                //hide woman
                this.object.visible = false;

                 //character returns to original walking speed
                 characterControls.setOriginalSpeed();

                 //hide stage complete
                 const stageComplete = document.getElementById('stageComplete');
                 stageComplete.style.display = 'none';

            }
        }


    }
    subtitle2() {


        if (!this.subtitleState.t2) {
            subtitleManager.showSubtitles();
            if (!this.subtitleStarted.t2) {
                //start showing the subtitle
                subtitleManager.startTime();
                subtitleManager.setDuration(5);
                subtitleManager.changeSubtitlesText(this.subtitleText.t2);
                this.subtitleStarted.t2 = true;
            }

            subtitleManager.countTime();

            if (!subtitleManager.checkTime()) {
                this.subtitleState.t2 = true;
                subtitleManager.hideSubtitles();
                 //meaning it was shown
                this.startSubs = false;
            
            }
        }


    }


    //ANIMATIONS===================================
    loadModel() {
        //load the main character model with an FBX Loader
        const loader = new FBXLoader(loadingManager);
        loader.setPath('../models/characters/');
        loader.load('jill.fbx', (fbx) => {
            //scale the model down
            fbx.scale.setScalar(0.0115);
            fbx.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });


            //animate character
            const anim = new FBXLoader(loadingManager);
            anim.setPath('../models/characters/WAnimations/');
            anim.load('Idle.fbx', (anim) => {
                this.walkMixer = new THREE.AnimationMixer(fbx);
                //set the initial animation for our main character to be idle (as he is not moving)
                this.animation = this.walkMixer.clipAction(anim.animations[0]);
                this.animation.reset();
                this.animation.play();
            });

            this.object.add(fbx);
        });
    }


}