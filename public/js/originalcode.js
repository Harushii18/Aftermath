//THIS CODE IS JUST THE ORIGINAL CODE I HAD BEFORE
//KEEPING IT TO SEE IF IT WILL WORK IN THE FUTURE
    
    const scene = new THREE.Scene();
    //Field of view, aspect ratio (normally width/height), near, far (anything out of it gets clipped)
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

/*
    //this just creates a cube for the demo. For the real scene, we will be importing pre-made blender models
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

*/

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
     
// Instantiate a loader
const loader = new THREE.GLTFLoader();

// Load a glTF resource
loader.load(
    // resource URL
    'models/house-layout.glb',
    // called when the resource is loaded
    function ( gltf ) {
        gltf.position.set(0,0,0);
        scene.add( gltf.scene );

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },
    // called while loading is progressing
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);
    //camera z distance away from object (in this case cube). If we decrease the z amount, we will go closer to the object
    camera.position.z = 1;
   


    //this function does animation, as well as renders our object to the viewport
    function animate() {
        requestAnimationFrame( animate );
        //ALL ANIMATIONS GO HERE
     // cube.rotation.x += 0.01;
    //  cube.rotation.y += 0.01;

        //render the scene with the specified camera
        renderer.render( scene, camera );
    }

    //call up the animating and rendering
    animate();
