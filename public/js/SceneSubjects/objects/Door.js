import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class Door extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();
        loader.setPath('../../models/');
        this.stop = true;
        var gltf = loader.load('testdoor.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });
            this.object.scale.x = 0.271;
            this.object.scale.y = 0.271;
            this.object.scale.z = 0.271;
           
            this.idleMixer = new THREE.AnimationMixer(gltf.scene);
            this.idleMixer.timeScale = 0.2;
            this.idle = this.idleMixer.clipAction(gltf.animations[0]);
           // this.idle.play();


            this.object.add(gltf.scene);
        });

    }

    setPosition(x,y,z){
        this.object.position.set(x, y, z);
    }

    setRotation(angle){
        this.object.rotateOnAxis( new THREE.Vector3(0,1,0),angle);
    }

   
    update(time) {

        console.log(time);

        if (this.stop == false) {
            if (this.idleMixer) {
                this.idleMixer.update(this.clock.getDelta());
            }
        }

        if (keyboardManager.wasPressed('E')) {
           
            if (this.stop == true) {
                this.idle.play();
                this.stop = false;
            }
            else {
                this.idleMixer.stopAllAction();
                this.stop = true;
            }
        }
    }



}
