import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { loadingManager, mainChar } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';

export class BedroomDrawer extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        //initialise subtitle contents
        this.initialiseSubtitleContents();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;

        //variable to start subtitles
        this.startSubtitles = false;
        this.showNoKeySubtitles=false;

        //checks if key was found
        this.keyFound = false;

        this.doCheckVicinity = true;
        //we change this to true when the other events have been allowed
        this.allowInteraction = false;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);

        loader.setPath('../../models/3DObjects/');

        this.open = false; //keeps track if the drawer is openend

        var gltf = loader.load('bedroomDrawer.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            // //scale drawer
            this.object.scale.x = 8;
            this.object.scale.y = 8;
            this.object.scale.z = 8;

            //move drawer
            this.object.position.set(20.15, 1.6, 27);



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
            t1: "The drawer is locked. I need to find a way to open it",
            t2: "There's a key!"
        };
    }

    setAllowInteraction(value){
        this.allowInteraction=value;
    }

    showSubtitlesWithoutKey(duration) {
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
                this.showNoKeySubtitles=false;
                //meaning it was shown
            }
        }
    }
    showSubtitlesWithKey(duration) {
        //subtitles that need to be shown if he has the key
        if (!this.subtitleState.t2) {
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
                this.subtitleStarted = false;
                //meaning it was shown
            }
        }

    }
    update(time) {

        if (this.startSubtitles) {
            this.showSubtitlesWithKey(80);
        }
        if (this.showNoKeySubtitles){
            this.showSubtitlesWithoutKey(80);
        }

        if (this.open == false) {
            //just to show the div
            var checkVicinity = this.checkCharacterVicinity();
        }

        //on button E press, move drawer
        if (keyboardManager.wasPressed('E')) {
            if (this.doCheckVicinity) {
                if (checkVicinity) {
                    //only allow the drawer to open when hammer was found
                    if (this.allowInteraction) {
                        this.open = true;
                        this.startSubtitles = true;

                        //add that he found the key
                        this.keyFound = true;
                        //make sure vicinity can no longer be checked: do not show overlay anymore
                        this.doCheckVicinity = false;
                        gameOverlay.hideOverlay();
                    }else{
                        this.showNoKeySubtitles=true;
                        this.subtitleState.t1 = false;
                        this.subtitleStarted.t1=false;
                    }
                }
            }
        }

        if (this.open == true) {
            if (this.object.position.z > 29.5) {    //stop moving
                this.open = false;
            }
            else {
                this.object.position.z += 0.1; //move to the left
            }
        }
    }

    isKeyFound() {
        return this.keyFound;
    }


    //checks if Character is in vicinity of drawer to open/ close it
    checkCharacterVicinity() {
        if (this.doCheckVicinity) {
            //get the position of the main character
            let pos = mainChar.returnWorldPosition();

            //variable that allows change in vicinity position in which E needs to be pressed:
            var vicinityLimitZ = 20;
            var vicinityLimitX = 5;

            //if the character is in the vicinity of the drawer
            if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
                //display interaction overlay if it isn't being shown
                if (this.count == 0) {
                    if (this.open == false) {
                        gameOverlay.changeText('[E] OPEN DRAWER');
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
    }

}
