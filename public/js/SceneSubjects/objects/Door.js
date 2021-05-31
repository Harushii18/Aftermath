import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
import { mainChar } from '../../managers/SceneManager.js';

export class Door extends THREE.Object3D {
    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');
        this.open = false; //open door animation

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
            this.idleMixer.timeScale = 0.08; //speed of animation
            this.idle = this.idleMixer.clipAction(gltf.animations[0]);
            this.idle.clampWhenFinished=true;
            
           // this.idle.play();



            this.object.add(gltf.scene);
        });

    }


    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }

    setRotation(angle) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    }


    update(time) {

        //console.log(time);


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
            //if character is in vicinity of door, then they can open door
            if (this.checkCharacterVicinity()) {
                if (this.open == false) { // animate

                    //this.startTime=time;
                    this.idle.play();
                    this.idle.loop = THREE.LoopOnce;
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


    //checks if Character is in vicinity of door to open/ close it
    checkCharacterVicinity() {
        //get the position of the main character
        let pos = mainChar.returnWorldPosition();

        //variable that allows change in vicinity position in which E needs to be pressed:
        var vicinityLimitZ=20;
        var vicinityLimitX=10;

        //if the character is in the vicinity of the door
        if (((pos.z < this.object.position.z + vicinityLimitZ) && (pos.z > this.object.position.z - vicinityLimitZ)) && (((pos.x < this.object.position.x + vicinityLimitX)) && ((pos.x > this.object.position.x - vicinityLimitX)))) {
            return true;
        }

        //if the character is not in the vicinity, return false
        return false;
    }

    return3DObject(){
     return this.object;
    }


}
