import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class Pin extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.up= true; //hover animation 
                    //if pin should move up or down 

        var gltf = loader.load('pin.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale pin
            this.object.scale.x = 0.5;
            this.object.scale.y = 0.5;
            this.object.scale.z = 0.5;

            //move pin
            this.object.position.set(-12, 9, 61); //(x,y,z)

            // //rotate pin
            // this.object.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2*0.5);



            this.object.add(gltf.scene);
        });

    }

    update(time) {

        if(this.object.position.y>9.5){
           
            this.up=false; //pin must move down 
          
        }
        else if(this.object.position.y<9){
            
            
            this.up=true; //pin must move up 
        }
        
        if(this.up==true){
            this.object.position.y+=0.03;
        }
        else if(this.up==false){
            this.object.position.y-=0.03;
        }
        else{
            //
        }


      



    }



}
