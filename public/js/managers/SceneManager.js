//IMPORT STATEMENTS

//style
import anime from '../../jsm/animejs/lib/anime.es.js';

import { EntityManager } from './EntityManager.js';

import { AudioManager } from './AudioManager.js';
import { LightingManager } from './LightingManager.js';
import { Time } from '../Time.js';
import { PauseMenu } from '../SceneSubjects/Menu/PauseMenu.js';
import { keyboardManager } from './KeyboardManager.js';
import { CollisionsManager } from './CollisionsManager.js'; //Collision Manager

//lights
import { GeneralLights } from '../SceneSubjects/lighting/GeneralLights.js';
import { CeilingLight } from '../SceneSubjects/lighting/CeilingLight.js';
import { AmbientLight } from '../SceneSubjects/lighting/AmbientLight.js';
import { CeilingLightObj } from '../SceneSubjects/objects/CeilingLightObj.js';

//OBJECTS
import { House } from '../SceneSubjects/House.js';
import { SceneSubject } from '../SceneSubjects/objects/SceneSubject.js';
import { TestBlock } from '../SceneSubjects/characters/TestBlock.js';
import { Door } from '../SceneSubjects/objects/Door.js';

import { BedroomPainting } from '../SceneSubjects/objects/BedroomPainting.js';
import { BedroomDrawer } from '../SceneSubjects/objects/BedroomDrawer.js';
import { CupboardDoorR } from '../SceneSubjects/objects/CupboardDoorR.js';
import { Hammer } from '../SceneSubjects/objects/Hammer.js';
import { Pin } from '../SceneSubjects/objects/Pin.js';
import { LetterI } from '../SceneSubjects/objects/LetterI.js';
import { Key } from '../SceneSubjects/objects/Key.js';


//Characters
import { MainChar } from '../SceneSubjects/characters/MainChar.js';

//study
import { Bookshelf } from '../SceneSubjects/objects/Bookshelf.js';


//other
import { PointerLockControls } from '../../jsm/PointerLockControls.js';
import { OrbitControls } from '../../jsm/OrbitControls.js';
import * as THREE from '../../../jsm/three.module.js';
import { characterControls } from './CharacterControls.js';
//pre-loader
import { HUD } from '../Overlay/HUD.js';

//==================================================================================================

//Global Variables

//FirstPersonTracker
var isFirstPersonView = true;

//lights
var generalLights = new GeneralLights();

//ceiling lights
var bedroomLightObj = new CeilingLightObj();
var kitchenLightObj = new CeilingLightObj();
var studyLightObj = new CeilingLightObj();
var hallwayLightObj1 = new CeilingLightObj();
var hallwayLightObj2 = new CeilingLightObj();
var bathroomLightObj = new CeilingLightObj();
var loungeLightObj = new CeilingLightObj();

var bedroomLight = new CeilingLight();
var kitchenLight = new CeilingLight();
var studyLight = new CeilingLight();
var hallwayLight1 = new CeilingLight();
var bathroomLight = new CeilingLight();
var hallwayLight2 = new CeilingLight();
var loungeLight = new CeilingLight();

var ambientLight = new AmbientLight();

//objects
var house = new House();
//var sceneSubject = new SceneSubject();
//var testBlock = new TestBlock();
var testdoor = new Door();

//study
var bookshelf = new Bookshelf();

//bedroom
var bedroomPainting = new BedroomPainting();
export var bedroomDrawer = new BedroomDrawer();
export var cupBoardDoorR = new CupboardDoorR();
export var hammer = new Hammer();
export var pin = new Pin();
var letterI = new LetterI();
var key = new Key();


//pre-loader
export var loadingManager;


//Collision Manager to add all objects that need to be collided with
const collisionManager = new CollisionsManager();
//Add collidable objects here
collisionManager.addObject(house);
//collisionManager.addObject(testBlock);
collisionManager.addObject(testdoor);

//Pass collidable objects as a parameter to the main character (raycasting implementation)
export var mainChar = new MainChar(collisionManager.returnObjects());


export class SceneManager {

    constructor(canvas) {
        //this entire function renders a scene where you can add as many items as you want to it (e.g. we can create the house and add as
        //many items as we want to the house). It renders objects from other javascript files
        //------------------------------------------------------------------------------------------------------------------------------------------
        //These are supposed to act like constants. DO NOT CHANGE
        this.GAME_PAUSE = "pause";
        this.GAME_RUN = "run";
        this.GAME_MENU = "menu";
        this.GAME_INTRO = "intro";
        //------------------------------------------------------------------------------------------------------------------------------------------
        this.audioActive = false;
        //we use (this) to make variables accessible in other classes
        this.time = new Time();
        this.objPauseMenu;
        //this.hud;



        this.game_state = this.GAME_MENU;



        this.width_screen = canvas.width;
        this.height_screen = canvas.height;

        this.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };

        //the essentials for rendering a scene
        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);

        //loading manager
        loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = function (item, loaded, total) {
            //  console.log(item, loaded, total);
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');

            // optional: remove loader from DOM via event listener
            loadingScreen.addEventListener('transitionend', this.onTransitionEnd);

        };

        loadingManager.onLoad = function () {
            console.log('loaded all resources');
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.display = "none";
        }

        loadingManager.onError = function(){
          console.log("Encountered Loading Error");
        }

        //Post-processing Effects
        //  this.composer = new EffectComposer(this.renderer);
        //  this.composer.addPass(new RenderPass(this.scene,this.camera));

        //comment this out
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 7;
        this.controls.maxDistance = 12;
        this.controls.maxPolarAngle = Math.PI / 2.5;

        //initialise pointerlock controls
        this.pointerLockControls = new PointerLockControls(this.camera, this.renderer.domElement);
        //this.pointerLockControls.lock();

        //this.scene.add(this.pointerLockControls.getObject());
        //====================

        //adjust the ceiling light properties in the house
        this.setCeilingLightProperties();

        this.managers = this.createManagers();

        //load things to scene
        this.loadToScene(this.managers[0].lights);
        this.loadToScene(this.managers[1].entities);





        //  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;//request pointer lock from player
        //  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;//exit pointer lock


        //Define new listener for clicking on the canvas
        canvas.onclick = function () {
            canvas.requestPointerLock(); //If canvas clicked, request pointer lock
        };


        //---------------------------------------------------------------------------------------------------------------------------------
        // Ok, now we have the cube. Next we'll create the hud. For that we'll
        // need a separate scene which we'll render on top of our 3D scene. We'll
        // use a dynamic texture to render the HUD.


        // We will use 2D canvas element to render our HUD.

        //---------------------------------------------------------------------------------------------------------------------------------
        this.hud = new HUD(this.width_screen, this.height_screen);

    }





    loadToScene(entities) {

        for (let i = 0; i < entities.length; i++) {

            this.scene.add(entities[i].object);


        }
    }
    //this function creates our scene
    buildScene() {
        //create a new scene
        const scene = new THREE.Scene();

        //set the scene's background-> in this case it is our skybox
        const loader = new THREE.CubeTextureLoader();
        //it uses different textures per face of cube
        const texture = loader.load([
            '../skybox/House/posx.jpg',
            '../skybox/House/negx.jpg',
            '../skybox/House/posy.jpg',
            '../skybox/House/negy.jpg',
            '../skybox/House/posz.jpg',
            '../skybox/House/negz.jpg'
        ]);
        scene.background = texture;

        //if we wanted it to be a colour, it would have been this commented code:
        //scene.background = new THREE.Color("#000");
        return scene;
    }

    //this creates a renderer for us
    buildRender({ width, height }) {

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true, alpha: true
        });
        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.shadowMap.enabled = true;
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMapSoft = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        return renderer;
    }

    //create a camera for the screen
    buildCamera({ width, height }) {

        //SETTING FIELD OF VIEW, ASPECT RATIO (which should generally be width/ height), NEAR AND FAR (anything outside near/ far is clipped)
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 1000;

        //there are 2 types of cameras: orthographic and perspective- we will use perspective (more realistic)
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        //Set camera initial position to main character
        let pos = mainChar.returnWorldPosition();
        camera.position.set(pos.x, pos.y + 10, pos.z - 10);

        return camera;
    }

    setCeilingLightProperties() {
        //set their light positions
        bedroomLightObj.setLightPosition(0, 21, 50);
        bedroomLight.setLightPosition(0, 16, 50);


        loungeLightObj.setLightPosition(-45, 21, -60);
        loungeLight.setLightPosition(-45, 16, -60);

        studyLightObj.setLightPosition(35, 21, -50);
        studyLight.setLightPosition(35, 16, -50);

        kitchenLight.setLightPosition(-45, 16, 5);
        kitchenLightObj.setLightPosition(-45, 21, 5);

        bathroomLight.setLightPosition(45, 16, 15);
        bathroomLightObj.setLightPosition(45, 21, 15);

        hallwayLightObj1.setLightPosition(0, 21, -60);
        hallwayLight1.setLightPosition(0, 16, -60);

        hallwayLightObj2.setLightPosition(0, 21, 0);
        hallwayLight2.setLightPosition(0, 16, 0);

    }

    //add subjects to the scene
    createManagers() {

        const managers = [new LightingManager(), new EntityManager(), new AudioManager()];
        //can be altered so we can add multiple entities, and depending on which position
        //it is, certain ones won't be paused, and some will be
        //Note that these variables are declared globally before the class definition
        /*This is so that we can use any of these object's methods or values later somewhere else*/

        //lights
        //  managers[0].register(generalLights);

        managers[0].register(ambientLight);
        managers[0].register(bedroomLight);
        managers[0].register(loungeLight);
        managers[0].register(studyLight);
        managers[0].register(hallwayLight1);
        managers[0].register(hallwayLight2);
        managers[0].register(kitchenLight);
        managers[0].register(bathroomLight);



        //entities

        managers[1].register(loungeLightObj);
        managers[1].register(studyLightObj);
        managers[1].register(kitchenLightObj);
        managers[1].register(bathroomLightObj);
        managers[1].register(bedroomLightObj);
        managers[1].register(hallwayLightObj1);
        managers[1].register(hallwayLightObj2);

        managers[1].register(house);

        testdoor.setPosition(0, -0.5, 33);
        managers[1].register(testdoor);

        managers[1].register(mainChar);
        //managers[1].register(sceneSubject);
        //managers[1].register(testBlock);

        //study
        managers[1].register(bookshelf);

        //bedroom
        managers[1].register(bedroomPainting);
        managers[1].register(bedroomDrawer);
        managers[1].register(cupBoardDoorR);
        managers[1].register(hammer);
        managers[1].register(pin);
        managers[1].register(letterI);
        managers[1].register(key);


        managers[2].register("footstep", "assets/footstep.mpeg");
        managers[2].register("door_open", "assets/door_open.mpeg");
        managers[2].entities["door_open"].setLoop(false);
        managers[2].register("background", "assets/back_sound.mp3");

        return managers;
    }

    updateCameraPosition() {
        //Match camera position and direction to the character's position and direction
        let pos = mainChar.returnWorldPosition();
        let dir = mainChar.returnObjectDirection();
        //Set y to 10 to move camera closer to head-height

        //First Person View
        if (isFirstPersonView == true) {
            mainChar.setVisibility(false);
            this.pointerLockControls.getObject().position.set(pos.x, 17.5, pos.z); //Need to sort out position of camera at head height

        }
        //Third Person View
        else if (isFirstPersonView == false) {
            mainChar.setVisibility(true);
            this.pointerLockControls.unlock(); //Keep PointerLockControls unlocked
            this.controls.target.set(pos.x, 17.5, pos.z + dir.z);//Set position at player model and face the same direction as model
            this.controls.update();//Update Orbital Controls
        }

        this.updatePlayerRotation();//Make player face direction of mouse movement
    }

    updatePlayerRotation() {
        if (isFirstPersonView == true) {
            var mousePointer = new THREE.Vector3();
            mousePointer.normalize();
            this.pointerLockControls.getDirection(mousePointer);
            mainChar.updateDirection(mousePointer);
        }
        if (isFirstPersonView == false) {
            var directionOfCamera = new THREE.Vector3();
            directionOfCamera.normalize();
            this.camera.getWorldDirection(directionOfCamera);
            mainChar.updateDirection(directionOfCamera);
        }
    }

    //this updates the subject/model every frame
    update() {
        //won't call this loop if it's paused-> only for objects that need to be paused (managers that need to be paused)

        if (this.game_state == this.GAME_MENU) { //when the game start

            //id the start button
            const btnStart = document.getElementById("start");

            //start game pressed, remove start screen items
            btnStart.addEventListener("click", () => {

                const menu = document.getElementsByClassName("mainMenu");
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }
                //change state to game intro
                this.game_state = this.GAME_INTRO;


            });



        } else if (this.game_state == this.GAME_INTRO) {
            if (this.audioActive == false) {
                this.audioActive = true;

                this.managers[2].audioListener.context.resume();
                // this.managers[2].entities["background"].play();
            }

            //make intro screen visible
            const intro = document.getElementsByClassName("intro");
            for (let i = 0; i < intro.length; i++) {
                intro[i].style.display = 'flex';
            }

            //id the continue button
            const btnContinue = document.getElementById("continue");

            ////intro screen game pressed, remove intro screen items
            btnContinue.addEventListener("click", () => {
                for (let i = 0; i < intro.length; i++) {
                    intro[i].style.display = 'none';
                }
                //change state to game run
                this.game_state = this.GAME_RUN;
                this.managers[2].entities["background"].pause();
            });

        } else if (this.game_state == this.GAME_RUN) {

            //door open sounds---------------------------------------------------------------------------
            if (key.checkKeyTaken()) {
                testdoor.doCheckVicinity = true;
                if (keyboardManager.wasPressed('E') && testdoor.checkVicinity) {
                    if (this.managers[2].entities["door_open"].isPlaying == false) {
                        this.managers[2].entities["door_open"].setLoop(0);
                        console.log("PLAYING DOOR");
                        this.managers[2].entities["door_open"].play();
                    }
                }
            }
            //door open sounds---------------------------------------------------------------------------


            //TO EXPERIMENT WITH FOR LOOKING AROUND!
            //  this.camera.position.x += ( keyboardManager.getMouseX() - this.camera.position.x ) ;
            //   this.camera.position.y += ( - keyboardManager.getMouseY() - this.camera.position.y );
            // this.camera.lookAt( this.scene.position );

            //character footstep sounds---------------------------------------------------------------------------
            if (characterControls.checkMovement()) {
                if (this.managers[2].entities["footstep"].isPlaying == false) {
                    this.managers[2].entities["footstep"].play();
                }

            }
            else {
                this.managers[2].entities["footstep"].pause();

            }
            //character footstep sounds---------------------------------------------------------------------------

            const runTime = this.time.getRunTime();
            this.managers[0].update(runTime);

            this.managers[1].update(runTime);

            //check pause--------------------------------
            if ((keyboardManager.keyDownQueue[0] == "P")) {

                this.pause();
                keyboardManager.keyDownQueue.shift();

            }
            //--------------------------------------------

            //Check if view must be changed--------------------------------------------------------------------------------------------
            if ((keyboardManager.keyDownQueue[0] == "V") && isFirstPersonView == true) {
                console.log("Switching to Third-Person View");
                isFirstPersonView = false;
                keyboardManager.keyDownQueue.shift();
            }


            if ((keyboardManager.keyDownQueue[0] == "V") && isFirstPersonView == false) {
                console.log("Switching to First-Person View");
                isFirstPersonView = true;
                keyboardManager.keyDownQueue.shift();
            }

            //Check if view must be changed--------------------------------------------------------------------------------------------

            this.updateCameraPosition();
            //  console.log(this.pointerLockControls.getDirection());

            this.renderMainScene();



        }
        else if (this.game_state == this.GAME_PAUSE) {

            if (keyboardManager.keyDownQueue[0] == 'P') {

                this.unpause();
                keyboardManager.keyDownQueue.shift();

            }


            this.renderPauseMenu();

        }
    }

    renderPauseMenu() {

        //comment out
        this.pointerLockControls.unlock();
        // this.controls.update();
        this.objPauseMenu.update(this.time.getElapsedTime());

        this.renderer.autoClear = true;

        //render scene1
        this.renderer.render(this.scene, this.camera);

        //prevent canvas from being erased with next .render call
        this.renderer.autoClear = false;

        //just render scene2 on top of scene1
        this.renderer.getContext().disable(this.renderer.getContext().DEPTH_TEST);


        this.renderer.render(this.objPauseMenu.scene, this.objPauseMenu.camera);

        this.renderer.getContext().enable(this.renderer.getContext().DEPTH_TEST);


    }

    renderMainScene() {
        this.renderer.render(this.scene, this.camera);

        this.renderer.autoClear = false;//prevent canvas from being erased with next .render call
        this.renderer.getContext().disable(this.renderer.getContext().DEPTH_TEST);


        this.renderer.render(this.hud.scene, this.hud.camera);

        this.renderer.getContext().enable(this.renderer.getContext().DEPTH_TEST);
        this.renderer.autoClear = true;

    }

    //this resizes our game when screen size changed
    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }


    onTransitionEnd(event) {

        const element = event.target;
        element.remove();

    }
    pause() { //when pause mode is entered. The pause menu needs to be rendered.
        if (this.game_state == this.GAME_RUN) {
            this.game_state = this.GAME_PAUSE;
            this.time.pause();

            //hide divs that display instructions/ key prompts
            this.instructions = document.getElementById('gameInstructions');
            this.instructions.display = 'none';
            this.instructions = document.getElementById('gameBottom');
            this.instructions.display = 'none';

            /* for (let sound in this.managers[2].entities)//["footstep"].pause())
             {
                 this.managers[2].entities[sound].pause();
             }
   */
            //comment out

            this.managers[2].entities["footstep"].pause();
            this.pointerLockControls.lock(); // stop orbit controls from responding to use input

            this.objPauseMenu = new PauseMenu(this.width_screen, this.height_screen);
        }
    }

    unpause() {
        this.game_state = this.GAME_RUN;

        this.time.unpause();

        this.pointerLockControls.unlock(); // start orbit controls to respond to input
    }
}
