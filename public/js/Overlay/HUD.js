import { Overlay } from './Overlay.js';
//import {GLTFLoader} from '../../../jsm/GLTFLoader.js';
import * as THREE from '../../jsm/three.module.js';

export class HUD extends Overlay {
  constructor(width, height) {

    super(width, height);


    this.light  = new THREE.PointLight( 0xff0000, 1, 100 );
    this.light.position.set( 10, 10, 50 );
   // this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);

  //  this.light.target.position.set(0, 0, -20);
   // this.light.castShadow = true;
    //this.light.position.set(-20, 50, 10);

    //create crosshair torus----------------------------------------------------
    const geometry = new THREE.TorusGeometry(0.5,0.1,9,15,Math.PI*2);
    const material = new THREE.MeshBasicMaterial( { color: 0xc8c8c8 } );
    const torus = new THREE.Mesh( geometry, material );

    torus.position.set(0,0,-60);
    torus.set
    this.scene.add( torus );
    //-------------------------------------------------------------------------------------------------



    this.scene.add(this.light);



  }








  update(time) {

 //  this.object.position.set(5, Math.sin(time)/4, -20);

    //this.object.translateY(Math.sin(time));
    //console.log(time);

  }



  addObject(object)
  {
      this.scene.add(object);

  }




}
