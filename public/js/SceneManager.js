
//Global Variables
var generalLights = new GeneralLights();
var house = new House();
var sceneSubject = new SceneSubject();
var testBlock = new TestBlock();
var mainChar = new MainChar(testBlock);

class SceneManager {

    constructor(canvas) {
        //this entire function renders a scene where you can add as many items as you want to it (e.g. we can create the house and add as
        //many items as we want to the house). It renders objects from other javascript files
        //------------------------------------------------------------------------------------------------------------------------------------------
        //These are supposed to act like constants. DO NOT CHANGE
        this.GAME_PAUSE = "pause";
        this.GAME_RUN = "run";
        //------------------------------------------------------------------------------------------------------------------------------------------

        //we use (this) to make variables accessible in other classes
        this.time = new Time();



        this.game_state = this.GAME_RUN;


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


        //Allow camera to orbit target (player) - OrbitPlayer Controls

        //this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        //this.controls.target.set(0, 20, 0);
        //this.controls.update();



    }

    loadToScene(entities)
    {
        for (let i = 0 ; i < entities.length ; i++)
        {
            console.log("before" +i.toString());
            this.scene.add(entities[i].object);
            console.log("after");
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
            camera.position.set(pos.x,pos.y+10,pos.z-10);

            return camera;
        }

        //add subjects to the scene
        createManagers() {

            const managers=[new EntityManager()];
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
            this.camera.position.set(pos.x,10,pos.z);
            this.camera.rotation.set(dir.x,dir.y,dir.z);
        }

        //this updates the subject/model every frame
        update() {

            //won't call this loop if it's paused-> only for objects that need to be paused (managers that need to be paused)
            if (this.game_state == this.GAME_RUN)
            {
                const runTime = this.time.getRunTime();
                this.managers[0].update(runTime);
            }

            //update orbit controls
            //this.controls.update();


            this.updateCameraPosition();


            this.renderer.render(this.scene, this.camera);
        }

        //this resizes our game when screen size changed
        onWindowResize() {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);

        }

        pause(){ //when pause mode is entered. The pause menu needs to be rendered.
            this.game_state = this.GAME_PAUSE;
            this.time.pause();

        }

        unpause(){
            this.game_state = this.GAME_RUN;
            this.time.unpause();

        }

        

}
