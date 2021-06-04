import { Overlay } from '../../Overlay/Overlay.js';
import {GLTFLoader} from '../../../jsm/GLTFLoader.js';
import * as THREE from '../../../jsm/three.module.js';

export class PauseMenu extends Overlay {
  constructor(width, height) {

    super(width, height);
    //this.overlay = new Overlay(width,height);
 /*   var bitmap = this.canvas.getContext('2d');//this.canvas.getCanvasContext();
    bitmap.font = "Normal 40px Arial";
    bitmap.textAlign = 'center';
    bitmap.fillStyle = "rgba(100,100,100,0.5)";
    bitmap.fillText('Game is Paused', width / 2, height / 2);*/

    //lights
    //this.light = new THREE.PointLight(0xFFFFFF, 1.0);
    //this.light.position.set(-20, 50, 10);
    this.light = new THREE.DirectionalLight(0xFFFFFF, 1.0);

    this.light.target.position.set(0, 0, -20);
    this.light.castShadow = true;
    this.light.position.set(-20, 50, 10);

    this.light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);

    this.light2.target.position.set(0, 0, 20);
    this.light2.castShadow = true;
    this.light2.position.set(20, 50, 10);

  


    var menu_height = height/13;
    var geometry = new THREE.BoxGeometry(menu_height * this.aspectRatio,menu_height,2.5);

    var texture = THREE.ImageUtils.loadTexture("../assets/Help.jpg");
   //var texture = new THREE.TextureLoader("../assets/Help.jpg");
    var material = new THREE.MeshStandardMaterial({ flatShading: true });
    material.map = texture;

    this.object = new THREE.Mesh(geometry,material);
    //this.object = new THREE.Mesh(new THREE.BoxGeometry(5,5,10), new THREE.MeshStandardMaterial({flatShading:true}));
		//this.object = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(radius, 2), new THREE.MeshStandardMaterial({ flatShading: true }));
     
    //this.object.rotateY(Math.PI/4);
    //this.object.scale.set(5,5,2);
    this.object.position.set(5, 0, -20);

    this.object.rotateY(Math.PI/5);
   // this.object.rotateX(Math.PI/20);
    


    this.scene.add(this.object);
    this.scene.add(this.light);
    this.scene.add(this.light2);
    


    //
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

    //this.refreshPlane();


  }








  update(time) {

    this.object.position.set(5, Math.sin(time)/4, -20);

    //this.object.translateY(Math.sin(time));
    //console.log(time);

  }


  makeElementObject(type, width, height) {
    const obj = new THREE.Object3D
  
    const element = document.createElement( type );
    element.style.width = width+'px';
    element.style.height = height+'px';
    element.style.opacity = 0.999;
  


    obj.add(element);
  
    // make an invisible plane for the DOM element to chop
    // clip a WebGL geometry with it.
    var material = new THREE.MeshPhongMaterial({
      opacity	: 0,
      color	: new THREE.Color( 0x02A0FE ),
      blending: THREE.NoBlending
    });
  
    var geometry = new THREE.BoxGeometry( width, height, 1 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    obj.lightShadowMesh = mesh
    obj.add( mesh );
  
    return obj
  }
}