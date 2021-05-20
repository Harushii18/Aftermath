function SceneManager(canvas) {
//this entire function renders a scene where you can add as many items as you want to it (e.g. we can create the house and add as
//many items as we want to the house). It renders objects from other javascript files

    const clock = new THREE.Clock();
    
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
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
        
        const renderer = new THREE.WebGLRenderer({canvas: canvas, 
            antialias: true,alpha: true 
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
        const sceneSubjects = [
            //these come from te js folder sceneSubjects. If you want to add more subjects do the following:
            //reference the file in index.html, create a file and code it in sceneSubjects, and then reference it here

            //here we added a light to the scene and then the subject. If we didn't have a light, we wouldn't be able to see the subject
            //add it in the order of rendering
            new GeneralLights(scene),
            new House(scene),
            new MainChar(scene),
            //this is just an example, can remove it and replace with our char
            new SceneSubject(scene)
        ];

        return sceneSubjects;
    }

    //this updates the subject/model every frame
    this.update = function() {
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<sceneSubjects.length; i++)
        	sceneSubjects[i].update(elapsedTime);

        
        //update orbit controls
        controls.update();

        renderer.render(scene, camera);
    }

    //this resizes our game when screen size changed
    this.onWindowResize = function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(window.innerWidth, window.innerHeight);
 
    }
}