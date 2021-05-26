
export class Overlay {
    constructor(width, height) {

        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');

        // Create the camera and set the viewport to match the screen dimensions.
        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);

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