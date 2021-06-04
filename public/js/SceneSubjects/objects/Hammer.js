import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
export class Hammer extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();


        this.clock = new THREE.Clock();
        const loader = new GLTFLoader();

        loader.setPath('../../models/3DObjects/');

        this.up= true; //hover animation 
                    //if hammer should move up or down 

        var gltf = loader.load('hammer.glb', (gltf) => {
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });

            //scale hammer
            this.object.scale.x = 0.5;
            this.object.scale.y = 0.5;
            this.object.scale.z = 0.5;

            //move hammer
            this.object.position.set(0, 3, 60);

            //rotate hammer
            this.object.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI/2*0.5);



            this.object.add(gltf.scene);
        });

    }

    update(time) {

        if(this.object.position.y>5){
           
            this.up=false; //hammer must move down 
          
        }
        else if(this.object.position.y<3){
            
            
            this.up=true; //hammer must move up 
        }
        
        if(this.up==true){
            this.object.position.y+=0.04;
        }
        else if(this.up==false){
            this.object.position.y-=0.04;
        }
        else{
            //
        }


      



    }



}
