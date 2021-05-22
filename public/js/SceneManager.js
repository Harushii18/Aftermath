class SceneManager {
    constructor(canvas) {
        //this entire function renders a scene where you can add as many items as you want to it (e.g. we can create the house and add as
        //many items as we want to the house). It renders objects from other javascript files


        //we use (this) to make variables accessible in other classes
        this.clock = new THREE.Clock();

        const screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };

        //the essentials for rendering a scene
        const scene = buildScene();
        const renderer = buildRender(screenDimensions);
        const camera = buildCamera(screenDimensions);
        const sceneSubjects = createSceneSubjects(scene);

        //allow camera to orbit target (player)
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 20, 0);
        controls.update();

        //this function creates our scene
        function buildScene() {
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
        function buildRender({ width, height }) {

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
        function buildCamera({ width, height }) {

            //SETTING FIELD OF VIEW, ASPECT RATIO (which should generally be width/ height), NEAR AND FAR (anything outside near/ far is clipped)
            const aspectRatio = width / height;
            const fieldOfView = 60;
            const nearPlane = 1;
            const farPlane = 1000;

            //there are 2 types of cameras: orthographic and perspective- we will use perspective (more realistic)
            const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

            //set where the camera is
            camera.position.set(0, 10, 0);

            return camera;
        }

        //add subjects to the scene
        function createSceneSubjects(scene) {

            const managers=[new EntityManager()];
            //can be altered so we can add multiple entities, and depending on which position
            //it is, certain ones won't be paused, and some will be
            managers[0].register(new GeneralLights(scene));
            managers[0].register(new House(scene));
            managers[0].register(new MainChar(scene));
            managers[0].register(new SceneSubject(scene));

            return managers;
        }

        //this updates the subject/model every frame
        this.update = function () {
            //KAMERON NEEDS TO UPDATE THIS TO CORRECT TIMES:
             //(don't use elapsed times anymore)
            const elapsedTime = this.clock.getElapsedTime();
           

            //won't call this loop if it's paused-> only for objects that need to be paused (managers that need to be paused)
            for (let i = 0; i < sceneSubjects.length; i++)
                sceneSubjects[i].update(elapsedTime);


            //update orbit controls
            controls.update();

            renderer.render(scene, camera);
        };

        //this resizes our game when screen size changed
        this.onWindowResize = function () {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        };
    }
}