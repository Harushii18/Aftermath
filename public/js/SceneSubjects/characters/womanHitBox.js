import * as THREE from '../../../jsm/three.module.js';
export class WomanHitBox extends THREE.Object3D {
  constructor(woman) {
    //load a model and animate it
    //TODO!
    super();
    this.woman = woman;

    //creating a box (need to change it to a character with animations)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    material.transparent = true;
    material.opacity = 0.0;
    this.object = new THREE.Mesh(geometry, material);
    //this.object.castShadow = true;
    //this.object.receiveShadow = false;
    this.object.scale.x = 5;
    this.object.scale.y = 30;
    this.object.scale.z = 5;
    this.object.position.set(0, 0, -15);
    //this.keyboard = new THREEx.KeyboardState();
    //starting position for character

    //Creating the player camera




    this.update = function (time) {
      //Do nothing
      var womanPos = this.woman.getWomanPosition();
      var womanVis = this.woman.getWomanVisibility();

      this.object.position.set(womanPos.x,womanPos.y,womanPos.z);
      this.object.visible = womanVis;

    };

  }
  return3DObject() {
    return this.object;
  }

}
