import * as THREE from '../../jsm/three.module.js';
export class Overlay {
    constructor(width, height) {

        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');

        // Create the camera and set the viewport to match the screen dimensions.
        //----------------------------------------------------------------------------------
       //SETTING FIELD OF VIEW, ASPECT RATIO (which should generally be width/ height), NEAR AND FAR (anything outside near/ far is clipped)
       this.aspectRatio = width / height;
       const fieldOfView = 60;
       const nearPlane = 1;
       const farPlane = 1000;

       //there are 2 types of cameras: orthographic and perspective- we will use perspective (more realistic)
      this.camera = new THREE.PerspectiveCamera(fieldOfView, this.aspectRatio, nearPlane, farPlane);
       //Set camera initial position to main character
      // this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
       this.camera.position.set(0,  0, 0);

        // Create also a custom scene for HUD.
        this.scene = new THREE.Scene();

    }

    getCanvasContext() {
        return this.canvas.getContext('2d');
    }

    refreshPlane() {

        var texture = new THREE.Texture(this.canvas)
        texture.needsUpdate = true;

        // Create HUD material.
        var material = new THREE.MeshBasicMaterial({ map: texture });
        material.transparent = true;

        // Create plane to render the HUD. This plane fill the whole screen.
        var planeGeometry = new THREE.PlaneGeometry(this.width, this.height);
        var plane = new THREE.Mesh(planeGeometry, material);
        this.scene.add(plane);

    }

    update(time) {


    }
}