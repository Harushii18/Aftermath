import { Overlay } from '../../Overlay/Overlay.js';
import {GLTFLoader} from '../../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';

export class PauseMenu extends Overlay {
  constructor(width, height) {

    super(width, height);
    //this.overlay = new Overlay(width,height);
    var bitmap = this.canvas.getContext('2d');//this.canvas.getCanvasContext();
    bitmap.font = "Normal 40px Arial";
    bitmap.textAlign = 'center';
    bitmap.fillStyle = "rgba(100,100,100,0.5)";
    bitmap.fillText('Game is Paused', width / 2, height / 2);

  /*  this.scene = new THREE.Object3D();
    //load house model form blender file

    const loader = new GLTFLoader();
    loader.setPath('../models/');

    const gltf = loader.load('pause.glb', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });

      //Scale to this size when using GameHouse.glb
      //Scaling house 
  
      this.scene.add(gltf.scene);
    });

    this.light = new THREE.PointLight(0x7E0B0A, 1, 100);

    this.scene.add(this.light);*/

    this.refreshPlane();


  }








  update(time) {


  }
}