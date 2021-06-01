import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class BedroomPainting extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.move = false; //keeps track if the painting has moved 

        var gltf = loader.load('bedroompainting.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale painting 
            this.object.scale.x = 3.5;
            this.object.scale.y = 3.5;
            this.object.scale.z = 3.5;

            //move painting
            this.object.position.set(14, 12, 34);



            this.object.add(gltf.scene);
        });

    }

    update(time) {

        //on button E press, move painting to  the left 
        if (keyboardManager.wasPressed('E')) {
            this.move = true;

        }

        if (this.move == true) {
            if (this.object.position.x < 10) {    //stop moving 

                this.move = false;
                
            }
            else {
                this.object.position.x -= 0.1; //move to the left 

            }


        }



    }



}
