import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class BedroomDrawer extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.open = false; //keeps track if the drawer is openend 

        var gltf = loader.load('bedroomDrawer.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            // //scale drawer
            this.object.scale.x = 7;
            this.object.scale.y = 7;
            this.object.scale.z = 7;

            //move drawer
            this.object.position.set( 13.6, 1.7,26.1);



            this.object.add(gltf.scene);
        });

    }

    update(time) {

        //on button E press, move painting to  the left 
        if (keyboardManager.wasPressed('E')) {
            this.open = true;

        }

        if (this.open == true) {
            if (this.object.position.z > 28) {    //stop moving 

                this.open = false;

            }
            else {
                this.object.position.z += 0.1; //move to the left 

            }
        }






    }

}
