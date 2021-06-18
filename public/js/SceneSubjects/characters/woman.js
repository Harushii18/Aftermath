import * as THREE from '../../../jsm/three.module.js';
import { FBXLoader } from '../../../jsm/FBXLoader/FBXLoader.js';
//import { loadingManager, mainChar, testdoor, audioPlayQueue, audioPauseQueue } from '../../managers/SceneManager.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';
import { characterControls } from '../../managers/CharacterControls.js';
export class Woman extends THREE.Object3D {
    constructor( loadingManager, mainChar, testdoor, audioPlayQueue, audioPauseQueue) {
        super();
        this.loadingManager = loadingManager;
        this.mainChar = mainChar;
        this.testdoor = testdoor;
        this.audioPauseQueue = audioPauseQueue;
        this.audioPlayQueue = audioPlayQueue;

        //woman object
        this.object = new THREE.Object3D();
        this.object.position.set(0, 0, -15);
        this.womanVisible = false;
        this.object.visible = false;
        this.startSubs = false;
        this.spawnCoolDown = 0;
        this.playerKilledCount = 0;


      //  this.womanState = "entering";

        this.clock = new THREE.Clock();
        this.state='idle';


        //scale to correct size
        this.object.scale.x = 9;
        this.object.scale.y = 9;
        this.object.scale.z = 9;

        //load the model
        this.loadModel();
        //make sure animations are pre-loaded
        this.anim = {};
        this.loadAllAnimations();

        //how many times he has successfully warded off the woman for her to give up the handle
        this.handleCount = 0;



        this.initialiseSubtitleContents();
        this.initialInteraction = false;


        this.update = function (time) {


          //console.log(this.spawnCoolDown);


            //IF LEVEL 1 IS COMPLETE ONLY!
            if (this.getLevel1Complete()) {
                //ensure that all movement is not by frame rate
                this.delta = this.clock.getDelta();




                //animation
                if (this.walkMixer) {
                    this.walkMixer.update(this.delta);
                }


                //INITIAL INTERACTION WITH WOMAN===================

                if (!this.initialInteraction) {
                    if (this.checkCharacterVicinity()) {
                        this.startSubs = true;
                        this.playAnim(this.anim['injuredWalk'], 'injuredWalk');


                    }
                    if (this.startSubs) {

                        if (this.object.position.z<this.mainChar.getWorldPosition().z){

                            this.object.position.z+=(this.delta*5)
                        }
                        if (this.subtitleState.t2 == false) {
                            this.subtitle1();

                            //if first subs been shown
                            if (this.subtitleState.t1) {
                                this.subtitle2();
                                this.despawnWoman();
                            }
                        }

                    }


                }
                else{
                  if(this.playerKilledCount<=3){

                  //console.log(this.spawnCoolDown);
                  ///Allow main character to use the flashlight to get rid of the woman
                  mainChar.setAllowAttack(true);
                  if(this.spawnCoolDown<=0){
                    this.spawnCoolDown = 0;
                    //console.log("Spawned Woman");
                    //Woman must respawn
                    this.object.visible = true;
                    var charPos = mainChar.returnWorldPosition();
                    var charDirection = mainChar.returnObjectDirection();
                  //  this.object.position.set(this.object.position.x + charDirection.x, this.object.position.y, this.object.position.z + charDirection.z)

                    if(this.object.position.x < charPos.x){
                      this.object.position.x += (this.delta*4);
                    }
                    if(this.object.position.x > charPos.x){
                      this.object.position.x -= (this.delta*4);
                    }

                    if(this.object.position.z < charPos.z){
                      this.object.position.z += (this.delta*4);
                    }
                    if(this.object.position.z > charPos.z){
                      this.object.position.z -= (this.delta*4);
                    }

                  }
                  else{
                    this.spawnCoolDown -= (this.delta*0.25);
                    //console.log(this.spawnCoolDown);
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


    despawnWoman(){
      //console.log("Despawned Woman");
      this.object.position.set(0, 0, -15);
      this.object.visible = false;
      this.spawnCoolDown = 5;
    }

    updatePlayerKilledCount(){
      this.playerKilledCount += 1;
    }

    //ANIMATIONS===================================
    checkAnimState(state) {
        //checks if the curr animation is already playing
        return (this.state == state);
    }

    setAnimState(state) {
        //changes curr animation state
        this.state = state;
    }

    loadAllAnimations() {
        var womanPath = '../models/characters/WAnimations/';

        //injured walk
        this.loadAnim('injuredWalk', womanPath, 'InjuredWalk.fbx');
        //Hurt
        this.loadAnim('hurt', womanPath, 'Hurt.fbx');
        //Dead
        this.loadAnim('dead', womanPath, 'Dead.fbx');

    }

    determineAnimations() {
        //if move false
        this.playAnim(this.anim['idle'], 'idle');
        //if move true
        this.playAnim(this.anim['idle'], 'idle');
    }

    loadAnim(state, path, file) {
		//load the animation
		const anime = new FBXLoader(this.loadingManager);
		anime.setPath(path);
		anime.load(file, (anime) => {

			//store animation in dictionary for access later
			this.anim[state] = anime;
		});
	}


    playAnim(animation, state) {
        if (!this.checkAnimState(state)) {
            //if she is not currently doing this animation, set the animation state to this new animation
            this.setAnimState(state);

            //make the walkMixer do this action
            animation = this.walkMixer.clipAction(animation.animations[0]);
            animation.reset();

            animation.clampWhenFinished = true;

            //cross fade from the previous animation
            animation.crossFadeFrom(this.currAction, 0.2, true);
            this.currAction = animation;

            //play the loaded animation
            animation.play();
        }

    }

    loadModel() {
        //load the main character model with an FBX Loader
        const loader = new FBXLoader(this.loadingManager);
        loader.setPath('../models/characters/');
        loader.load('jill.fbx', (fbx) => {
            //scale the model down
            fbx.scale.setScalar(0.0115);

          /*  fbx.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
                this.currAction = this.idle;

            });*/


            this.currAction = this.idle;

            //animate character
            const anim = new FBXLoader(this.loadingManager);
            anim.setPath('../models/characters/WAnimations/');
            anim.load('Idle.fbx', (anim) => {
                this.walkMixer = new THREE.AnimationMixer(fbx);
                //set the initial animation for our main character to be idle (as he is not moving)
                this.animation = this.walkMixer.clipAction(anim.animations[0]);
                this.anim['idle'] = this.animation;
                this.currAction=this.animation;
                this.animation.reset();
                this.animation.play();

            });

            this.object.add(fbx);
        });
    }

    //===============================================================================

    inVicinity(vicinityLimitZ, vicinityLimitX) {
        //get the position of the main character
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

    getLevel1Complete() {
        //IF LEVEL 1 IS COMPLETE!
        this.level1Complete = this.testdoor.level1Complete(); //if you want to test from lvl2 , make it true

        if (this.level1Complete) {
            if (!this.womanVisible) {
                //show the woman now that the door has opened
                this.object.visible = true;
                this.womanVisible = true;

                this.audioPlayQueue.push("ghost_wail");
                

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
                //this.object.visible = false;

                this.audioPauseQueue.push("ghost_wail");
                 //character returns to original walking speed
                 characterControls.setOriginalSpeed();

                //hide stage complete
                const stageComplete = document.getElementById('stageComplete');
                stageComplete.style.display = 'none';

            }
        }


    }
    subtitle2() {
      //console.log("Playing subtitle 2");
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
                this.initialInteraction = true;
              }
        }


    }

    getWomanPosition() {
      let worldPos = new THREE.Vector3();
      this.object.getWorldPosition(worldPos);
      return worldPos;
    }

    getWomanVisibility(){
      return this.object.visible;
    }

    return3DObject() {
        return this.object;
    }



}
