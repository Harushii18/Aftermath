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
import { Lock } from '../SceneSubjects/objects/Lock.js'
import { SceneSubject } from '../SceneSubjects/objects/SceneSubject.js';
import { TestBlock } from '../SceneSubjects/characters/TestBlock.js';
import { Door } from '../SceneSubjects/objects/Door.js';

import { BedroomPainting } from '../SceneSubjects/objects/BedroomPainting.js';
import { BedroomDrawer } from '../SceneSubjects/objects/BedroomDrawer.js';

import { Hammer } from '../SceneSubjects/objects/Hammer.js';
import { Flashlight } from '../SceneSubjects/objects/Flashlight.js';
import { cupboardDoorR } from '../SceneSubjects/objects/cupboardDoorR.js';
import { Pin } from '../SceneSubjects/objects/Pin.js';
import { LetterI } from '../SceneSubjects/objects/LetterI.js';
import { Key } from '../SceneSubjects/objects/Key.js';
import { Crowbar } from '../SceneSubjects/objects/Crowbar.js';
import { LightSwitch } from '../SceneSubjects/objects/Switch.js';
import { Plank } from '../SceneSubjects/objects/Plank.js';



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
import { Woman } from '../SceneSubjects/characters/woman.js';

//==================================================================================================

//Global Variables
export var hudOverlayAddQueue = [];
export var hudOverlayRemoveQueue = [];
export var sceneRemoveQueue = [];




//FirstPersonTracker
var isFirstPersonView = true;

//objects
var house = new House();

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
// var kitchenLight = new CeilingLight();
// var studyLight = new CeilingLight();
// var hallwayLight1 = new CeilingLight();
// var bathroomLight = new CeilingLight();
// var hallwayLight2 = new CeilingLight();
// var loungeLight = new CeilingLight();

var ambientLight = new AmbientLight();


//var sceneSubject = new SceneSubject();
//var testBlock = new TestBlock();
export var testdoor = new Door();

//study
var bookshelf = new Bookshelf();

//bedroom
var bedroomPainting = new BedroomPainting();

export var lockCupboard = new Lock();
//var lockDrawer = new Lock();

//lockDrawer.setScale(new THREE.Vector3(10,10,10));
//lockDrawer.setPosition(new THREE.Vector3(20.15, 7.6, 50));

export var bedroomDrawer = new BedroomDrawer();
export var cupBoardDoorR = new cupboardDoorR();
export var hammer = new Hammer();
export var pin = new Pin();

export var flashlight = new Flashlight();

export var crowbar = new Crowbar();
export var lightswitch = new LightSwitch();
export var plank = new Plank();
export var plank1 = new Plank();
export var plank2 = new Plank();

var letterI = new LetterI();
var key = new Key();





//pre-loader
export var loadingManager;


//Collision Manager to add all objects that need to be collided with
const collisionManager = new CollisionsManager();
//Add collidable objects here
collisionManager.addObject(house);
//collisionManager.addObject(cupBoardDoorR);
//collisionManager.addObject(testBlock);
collisionManager.addObject(testdoor);

//Pass collidable objects as a parameter to the main character (raycasting implementation)
export var mainChar = new MainChar(collisionManager.returnObjects());

//woman
var woman = new Woman();

export class SceneManager {

    constructor(canvas) {
        //for animations
        this.clock=new THREE.Clock();
        //this entire function renders a scene where you can add as many items as you want to it (e.g. we can create the house and add as
        //many items as we want to the house). It renders objects from other javascript files
        //------------------------------------------------------------------------------------------------------------------------------------------
        //These are supposed to act like constants. DO NOT CHANGE
        this.GAME_PAUSE = "pause";
        this.GAME_RUN = "run";
        this.GAME_MENU = "menu";
        this.GAME_INTRO = "intro";
        this.GAME_LOGO = "logo";
        //------------------------------------------------------------------------------------------------------------------------------------------
        this.audioActive = false;
        //we use (this) to make variables accessible in other classes
        this.time = new Time();
        this.objPauseMenu;
        //this.hud;



        this.game_state = this.GAME_RUN;//default Game_LOGO
        //intro paragraph state
        this.intro_para = 4;//1


        this.width_screen = canvas.width;
        this.height_screen = canvas.height;

        this.screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };

        //the essentials for rendering a scene
        this.scene = this.buildScene();
        
        //create our skybox
        this.skybox=this.makeInstance(1, 0);

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

        loadingManager.onError = function () {
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


    //==================SKYBOX============================

    //determine color and map
    get255BasedColor(color) {
        const tempColor = new THREE.Color();
        tempColor.set(color);
        return tempColor.toArray().map(v => v * 255);
    }

    makeRampTexture(stops) {
        // let's just always make the ramps 256x1
        const res = 256;
        const data = new Uint8Array(res * 3);
        const mixedColor = new THREE.Color();

        let prevX = 0;
        for (let ndx = 1; ndx < stops.length; ++ndx) {
            const nextX = Math.min(stops[ndx].position * res, res - 1);
            if (nextX > prevX) {
                const color0 = stops[ndx - 1].color;
                const color1 = stops[ndx].color;
                const diff = nextX - prevX;
                for (let x = prevX; x <= nextX; ++x) {
                    const u = (x - prevX) / diff;
                    mixedColor.copy(color0);
                    mixedColor.lerp(color1, u);
                    data.set(this.get255BasedColor(mixedColor), x * 3);
                }
            }
            prevX = nextX;
        }

        return new THREE.DataTexture(data, res, 1, THREE.RGBFormat);
    }

    //create cube with calculated texture and colour co-ords
    makeInstance(scale, rot) {
        const texture = this.makeRampTexture([
            //colours for the textures
            { position: 0, color: new THREE.Color(0x0d182e), },
            { position: 0.5, color: new THREE.Color(0x284682), },
            { position: 1, color: new THREE.Color(0x0d182e), },
        ]);
        texture.repeat.set(1 / scale, 1 / scale);
        texture.rotation = rot;


        //create the skybox
        var skyGeometry = new THREE.BoxGeometry(200, 200, 200);
        const material = new THREE.MeshBasicMaterial({ map: texture, wireframe: false });
    
        /* Cause the material to be visible for inside and outside */
        material.side = THREE.BackSide;
        var skybox = new THREE.Mesh(skyGeometry, material);
        this.scene.add(skybox);

        return skybox;
    }

    //========================================================

    //this function creates our scene
    buildScene() {
        //create a new scene
        const scene = new THREE.Scene();

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
        //I COMMENTED THE LIGHTS OUT TO SEE IF IT IMPROVES PERFORMANCE
        bedroomLightObj.setLightPosition(0, 50);
        loungeLightObj.setLightPosition(-45, -60);
        studyLightObj.setLightPosition(35, -50);
        kitchenLightObj.setLightPosition(-45, 5);
        bathroomLightObj.setLightPosition(45, 15);
        hallwayLightObj1.setLightPosition(0, -60);
        hallwayLightObj2.setLightPosition(0, 0);

        bedroomLight.setLightPosition(0, 50);
        // loungeLight.setLightPosition(-45,  -60);
        //  studyLight.setLightPosition(35,  -50);
        //   kitchenLight.setLightPosition(-45,  5);
        //bathroomLight.setLightPosition(45, 15);
        // hallwayLight1.setLightPosition(0, 16, -60);
        //  hallwayLight2.setLightPosition(0, 0);

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
        // managers[0].register(loungeLight);
        // managers[0].register(studyLight);
        // managers[0].register(hallwayLight1);
        // managers[0].register(hallwayLight2);
        // managers[0].register(kitchenLight);
        // managers[0].register(bathroomLight);

        //------------------------------------------------------------

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
        managers[1].register(woman)

        //study
        managers[1].register(bookshelf);

        //bedroom
        managers[1].register(bedroomPainting);

        hammer.setForScene();
        managers[1].register(hammer);

        pin.setForScene();
        managers[1].register(pin);

        lockCupboard.object.name = "lockCupboard";
        managers[1].register(lockCupboard);
        managers[1].register(cupBoardDoorR);
        managers[1].register(letterI);

        managers[1].register(flashlight);

        managers[1].register(crowbar);
        managers[1].register(lightswitch);


        managers[1].register(plank);
        plank.setPosition(-4.5, 15, -77.5);
        plank.setRotation(Math.PI / 2)

        managers[1].register(plank1);
        plank1.setPosition(-4.5, 20, -77.5);
        plank1.setRotation(Math.PI / 2);

        managers[1].register(plank2);
        plank2.setPosition(-4.5, 10, -77.5);
        plank2.setRotation(Math.PI / 2);



        bedroomDrawer.object.position.set(20.2, 7.4, 36.7);
        managers[1].register(bedroomDrawer);
        //------------------------------------------------------------------------

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

            const menu = document.getElementsByClassName("mainMenu");
            for (let i = 0; i < menu.length; i++) {
                menu[i].style.display = 'flex';
            }

            //id the start button
            const btnStart = document.getElementById("start");
            const btnSkipIntro = document.getElementById("skipIntro");


            //start game pressed, remove start screen items
            btnStart.addEventListener("click", () => {

                const menu = document.getElementsByClassName("mainMenu");
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }
                //change state to game intro
                this.game_state = this.GAME_INTRO;


            });

            btnSkipIntro.addEventListener("click", () => {
                const menu = document.getElementsByClassName("mainMenu");
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }
                //change state to game intro
                this.game_state = this.GAME_RUN;
            });


        } else if (this.game_state == this.GAME_LOGO) {
            //id the divs
            const menu = document.getElementsByClassName("mainMenu");
            const logo = document.getElementsByClassName("logo");

            //make menu not visible
            for (let i = 0; i < menu.length; i++) {
                menu[i].style.display = 'none';
            }

            //make logo visible
            for (let i = 0; i < logo.length; i++) {
                logo[i].style.display = 'flex';
            }

            setTimeout(() => {
                //make logo not visible
                for (let i = 0; i < logo.length; i++) {
                    logo[i].style.display = 'none';
                }
                this.game_state = this.GAME_MENU;
            }, 3000);//deafault 12000

        } else if (this.game_state == this.GAME_INTRO) {
            if (this.audioActive == false) {
                this.audioActive = true;

                this.managers[2].audioListener.context.resume();
                this.managers[2].entities["background"].play();

            }

            //make intro screen visible
            const intro1 = document.getElementById("para1");
            const intro2 = document.getElementById("para2");
            const intro3 = document.getElementById("para3");
            const intro4 = document.getElementById("para4");


            //id the buttons
            //  const btnNext1 = document.getElementById("next1");
            //  const btnNext2 = document.getElementById("next2");
            const btnContinue = document.getElementById("continue");

            intro1.style.display = 'flex'; //CHANGE TO FLEX
            intro2.style.display = 'none';
            intro3.style.display = 'none';
            intro4.style.display = 'none';


            //UNCOMMENT=======================
            setTimeout(() => {
                intro1.style.display = 'none';
                intro2.style.display = 'flex';
                intro3.style.display = 'none';
                intro4.style.display = 'none';
            }, 100);

            setTimeout(() => {
                intro1.style.display = 'none';
                intro2.style.display = 'none';
                intro3.style.display = 'flex';
                intro4.style.display = 'none';
            }, 100);

            setTimeout(() => {
                intro1.style.display = 'none';
                intro2.style.display = 'none';
                intro3.style.display = 'none';
                intro4.style.display = 'flex';
            }, 100);
            //===========================

            //  intro4.style.display = 'flex'; //COMMENT OUT
            btnContinue.addEventListener("click", () => {

                this.intro_para = 4;
                intro1.style.display = 'none';
                intro2.style.display = 'none';
                intro3.style.display = 'none';
                intro4.style.display = 'none';

                const menu = document.getElementsByClassName("mainMenu");
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }
                //change state to game run
                this.game_state = this.GAME_RUN;

                this.managers[2].entities["background"].pause();
            });

            //  if(this.intro_para == 1){
            //  intro1.style.display = 'flex';
            //  intro2.style.display = 'none';
            //  intro3.style.display = 'none';

            //  btnNext1.addEventListener("click", () => {
            //     this.intro_para = 2;
            //  });
            //  }

            //  else if(this.intro_para == 2){
            //      intro1.style.display = 'none';
            //      intro2.style.display = 'flex';
            //      intro3.style.display = 'none';
            //      btnNext2.addEventListener("click", () => {
            //          this.intro_para = 3;
            //      });
            //  }

            //  else if(this.intro_para == 3){
            //      intro1.style.display = 'none';
            //      intro2.style.display = 'none';
            //      intro3.style.display = 'flex';
            //      btnContinue.addEventListener("click", () => {
            //          this.intro_para = 4;
            //          intro1.style.display = 'none';
            //          intro2.style.display = 'none';
            //          intro3.style.display = 'none';
            //          //change state to game run
            //          this.game_state = this.GAME_RUN;
            //      });
            //  }

        } else if (this.game_state == this.GAME_RUN) {

            //rotate skybox on game time
            var delta=this.clock.getDelta();
            //skybox rotation speed
            this.skybox.rotation.y += 0.1*delta;

            this.managers[2].entities["background"].pause();

            //hud elements
            this.removeHUDItems();
            this.addToHUD();
            this.removeFromScene()




            if (this.hud.hasItem('key') == false && bedroomDrawer.keyFound && testdoor.open == false) {
                console.log("key adde");
                var selectedObject = bedroomDrawer.object.getObjectByName('key');
                console.log(selectedObject);
                bedroomDrawer.object.remove(selectedObject);


                this.hud.add("key", new Key());
                testdoor.setAllowInteraction(true);


            }
            else if (this.hud.hasItem('key') && testdoor.open) {
                console.log("key removed");
                this.hud.remove('key');


            }
            //


            //door open sounds---------------------------------------------------------------------------
            if (this.hud.hasItem('key')) {
                testdoor.doCheckVicinity = true;
                if (keyboardManager.wasPressed('E') && testdoor.playDoorSound) {
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
                this.pointerLockControls.unlock();
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

            if (isFirstPersonView) {
                this.renderCrosshair();
            }

        } else if (this.game_state == this.GAME_PAUSE) {

            const menu = document.getElementsByClassName('pauseMenu');
            const unpause = document.getElementById('unpause');
            const mainMenu = document.getElementById('mainMenu');

            //make menu visible
            for (let i = 0; i < menu.length; i++) {
                menu[i].style.display = 'flex';
            }

            unpause.addEventListener('click', () => {
                //make menu not visible
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }
                this.unpause();
            });


            mainMenu.addEventListener('click', () => {
                //make menu not visible
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }
                this.game_state = this.GAME_MENU;
            });



            this.renderPauseMenu();

            if (keyboardManager.keyDownQueue[0] == 'P') {

                this.unpause();
                keyboardManager.keyDownQueue.shift();

                //make menu not visible
                for (let i = 0; i < menu.length; i++) {
                    menu[i].style.display = 'none';
                }

            }


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



    }

    renderCrosshair() {
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


    addToHUD() {
        if (hudOverlayAddQueue.includes("hammer")) {

            this.hud.add("hammer", new Hammer());
            console.log("hammer added to hud");
            hudOverlayAddQueue.shift();

        }

        if (hudOverlayAddQueue.includes("pin")) {

            this.hud.add("pin", new Pin());
            console.log("Pin added to hud");
            hudOverlayAddQueue.shift();

        }
    }

    removeHUDItems() {

        while (hudOverlayRemoveQueue.length > 0) {
            var name = hudOverlayRemoveQueue[0];
            hudOverlayRemoveQueue.shift();


            console.log(hudOverlayRemoveQueue.length);
            this.hud.remove(name);
            console.log(name + " removed from hud");

        }


    }


    removeFromScene() {

        while (sceneRemoveQueue.length > 0) {
            var name = sceneRemoveQueue[0];
            sceneRemoveQueue.shift();

            var selectedObject = this.scene.getObjectByName(name);
            this.scene.remove(selectedObject);

        }

    }

    unpause() {
        this.game_state = this.GAME_RUN;

        this.time.unpause();

        this.pointerLockControls.unlock(); // start orbit controls to respond to input
    }
}
