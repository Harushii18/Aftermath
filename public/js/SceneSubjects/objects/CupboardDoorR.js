import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class CupboardDoorR extends THREE.Object3D {

    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();
        loader.setPath('../../models/');
        loader.setPath('../../models/3DObjects/');
        this.open = false; //open door animation
        var axis = new THREE.Vector3(0, 0, 1);
        var rad=0;

        this.startTime = 0;

        var gltf = loader.load('cupboardDoorR.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });



            // //scale door
            this.object.scale.x = 0.8;
            this.object.scale.y = 0.8;
            this.object.scale.z = 0.8;

            //move door
            this.object.position.set(-12.5, -5, 66.3);





            this.object.add(gltf.scene);
        });

    }






    update(time) {


        //on button E press, move painting to  the left 
        if (keyboardManager.wasPressed('E')) {

            //  this.object.rotation.y-=0.1;
            ///
            // this.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), this.object.rotation.y - 0.1);
            // this.object.rotation.y -= 0.1;

            //declared once at the top of your code
           //tilted a bit on x and y - feel free to plug your different axis here
            //in your update/draw function
            // this.rad += 0.1;
            // this.object.rotateOnAxis(this.axis, this.rad);

          //  this.object.rotateY(-Math.PI/2);

            this.object.rotateOnAxis(new THREE.Vector3(0,1,0),this.object.rotation.y-0.1);

            this.open = true;

        }




    }
}
