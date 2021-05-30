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
        this.open = true; //open door animation

        this.startTime=0;

        var gltf = loader.load('testdoor.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale door 
            this.object.scale.x = 0.271;
            this.object.scale.y = 0.271;
            this.object.scale.z = 0.271;
           
            //play animation 
            this.idleMixer = new THREE.AnimationMixer(gltf.scene);
            this.idleMixer.timeScale = 0.2; //speed of animation
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

        // console.log(time);

        if (this.open == true) { //animate
            if (this.idleMixer) {
                this.idleMixer.update(this.clock.getDelta());
            }
        }

        // if (keyboardManager.wasPressed('E')){
        //     this.open=true;
        //     this.startTime=time;
        //     console.log(this.startTime);
        //     // console.log("waspressed E");
        //     this.idle.play();
            
        // }
        // // console.log("timer");
        // console.log(time);
        // if(time==this.startTime+5){
        //     this.idleMixer.stopAllAction();
        //     this.open=false;
        // }

        if (keyboardManager.wasPressed('E')) {
           
            if (this.open == false) { // animate

                //this.startTime=time;
                this.idle.play();
                // if(this.startTime==this.startTime+1){
                //     this.idleMixer.stopAllAction();//stop animation after start time+3
                //     this.open = false;
                // }
                this.open = true;
            }
            else {
                this.idleMixer.stopAllAction(); //stop animation
                this.open = false;
            }
        }
    }



}
