//IMPORT STATEMENTS
import { EntityManager } from './EntityManager.js';
import { GeneralLights } from '../SceneSubjects/lighting/GeneralLights.js';
import { House } from '../SceneSubjects/House.js';
import { SceneSubject } from '../SceneSubjects/objects/SceneSubject.js';
import { TestBlock } from '../SceneSubjects/characters/TestBlock.js';
import { MainChar } from '../SceneSubjects/characters/MainChar.js';
import { Time } from '../Time.js';
import { PauseMenu } from '../SceneSubjects/Menu/PauseMenu.js';
//==================================================================================================

//Global Variables
var generalLights = new GeneralLights();
var house = new House();
var sceneSubject = new SceneSubject();
var testBlock = new TestBlock();
var mainChar = new MainChar(testBlock);

export class SceneManager {

    constructor(canvas) {
        //this entire function renders a scene where you can add as many items as you want to it (e.g. we can create the house and add as
        //many items as we want to the house). It renders objects from other javascript files
        //------------------------------------------------------------------------------------------------------------------------------------------
        //These are supposed to act like constants. DO NOT CHANGE
        this.GAME_PAUSE = "pause";
        this.GAME_RUN = "run";
        this.GAME_START = "start";
        //------------------------------------------------------------------------------------------------------------------------------------------

        //we use (this) to make variables accessible in other classes
        this.time = new Time();
        this.objPauseMenu;



        this.game_state = this.GAME_RUN;

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

        //=========ERROR!!!
        //  controls = new THREE.PointerLockControls( this.camera );
        // this.scene.add(controls.getObject());
        this.managers = this.createManagers();
        this.loadToScene(this.managers[0].entities);



        //---------------------------------------------------------------------------------------------------------------------------------
        // Ok, now we have the cube. Next we'll create the hud. For that we'll
        // need a separate scene which we'll render on top of our 3D scene. We'll
        // use a dynamic texture to render the HUD.


        // We will use 2D canvas element to render our HUD.  

        //---------------------------------------------------------------------------------------------------------------------------------

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
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    //add subjects to the scene
    createManagers() {

        const managers = [new EntityManager(), new EntityManager()];
        //can be altered so we can add multiple entities, and depending on which position
        //it is, certain ones won't be paused, and some will be
        //Note that these variables are declared globally before the class definition
        /*This is so that we can use any of these object's methods or values later somewhere else*/
        managers[0].register(generalLights);
        managers[0].register(house);
        managers[0].register(mainChar);
        managers[0].register(sceneSubject);
        managers[0].register(testBlock);


        return managers;
    }

    updateCameraPosition() {
        //Match camera position and direction to the character's position and direction
        let pos = mainChar.returnWorldPosition();
        let dir = mainChar.returnObjectDirection();
        //Set y to 10 to move camera closer to head-height
        this.camera.position.set(pos.x, 10, pos.z);
        this.camera.rotation.set(dir.x, dir.y, dir.z);
    }

    //this updates the subject/model every frame
    update() {

        //won't call this loop if it's paused-> only for objects that need to be paused (managers that need to be paused)
        if (this.game_state == this.GAME_RUN) {
            const runTime = this.time.getRunTime();
            this.managers[0].update(runTime);
            //update orbit controls
            //this.controls.update();

            this.renderer.render(this.scene, this.camera);

        }
        else {
            // this.controls.update();

            this.renderer.autoClear = true;

            //render scene1
            this.renderer.render(this.scene, this.camera);

            //prevent canvas from being erased with next .render call
            this.renderer.autoClear = false;

            //just render scene2 on top of scene1
            this.renderer.render(this.objPauseMenu.scene, this.objPauseMenu.camera);



            // renderer.autoClear = true;

        }


        //update orbit controls
        //this.controls.update();


        this.updateCameraPosition();


    }

    //this resizes our game when screen size changed
    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    pause() { //when pause mode is entered. The pause menu needs to be rendered.
        this.game_state = this.GAME_PAUSE;
        this.time.pause();

        //this.controls.enabled = false; // stop orbit controls from responding to use input


        this.objPauseMenu = new PauseMenu(this.width_screen, this.height_screen);




    }

    unpause() {
        this.game_state = this.GAME_RUN;
        this.time.unpause();

        //this.controls.enabled = true; // start orbit controls tp respond to input

    }



}
