import { Overlay } from './Overlay.js';
//import {GLTFLoader} from '../../../jsm/GLTFLoader.js';
import * as THREE from '../../jsm/three.module.js';

export class HUD extends Overlay {
  constructor(width, height) {

    super(width, height);
    this.numItems = 0;

    this.items = new Set()
    this.light  = new THREE.PointLight( 0xff0000, 1, 100 );
    this.light.position.set( 10, 10, 50 );
    this.light2 = new THREE.DirectionalLight(0xFFFFFF, 3.0);

    this.light2.target.position.set(15, 6, -20);
    //this.light2.castShadow = true;
    this.light2.position.set(-20, 50, 10);

    //create crosshair torus----------------------------------------------------
    const geometry = new THREE.TorusGeometry(0.5,0.1,9,15,Math.PI*2);
    const material = new THREE.MeshBasicMaterial( { color: 0xc8c8c8 } );
    const torus = new THREE.Mesh( geometry, material );

    torus.position.set(0,0,-60);
    torus.set
    this.scene.add( torus );
    //-------------------------------------------------------------------------------------------------



    this.scene.add(this.light);
    this.scene.add(this.light2);



  }








  update(time) {

 //  this.object.position.set(5, Math.sin(time)/4, -20);

    //this.object.translateY(Math.sin(time));
    //console.log(time);

  }



  add(name,object)
  {
    object.object.name = name;
 
    object.object.rotateX(Math.PI/4);
    object.object.rotateY(Math.PI/4);
    object.object.rotateZ(Math.PI/4);
    object.object.position.set(20, 9 -(3*this.numItems), -20);
    this.scene.add(object.object);

    this.numItems += 1;
    this.items.add(name);

  }

  remove(name)
  {
    var selectedObject = this.scene.getObjectByName(name);
    console.log("removing from hud");
    console.log(selectedObject);
    this.scene.remove( selectedObject);
    this.items.delete(name);
    
  }

  hasItem(name)
  {
    return this.items.has(name);
  }



}
