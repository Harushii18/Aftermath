  
class GeneralLights extends THREE.Object3D {
    constructor() {
        super();
        this.object = new THREE.DirectionalLight(0xFFFFFF, 1.0);

        this.object.target.position.set(0, 0, 0);
        this.object.castShadow = true;
        this.object.shadow.bias = -0.001;
        this.object.shadow.mapSize.width = 2048;
        this.object.shadow.mapSize.height = 2048;
        this.object.shadow.camera.near = 0.1;
        this.object.shadow.camera.far = 500.0;
        this.object.shadow.camera.near = 0.5;
        this.object.shadow.camera.far = 500.0;
        this.object.shadow.camera.left = 100;
        this.object.shadow.camera.right = -100;
        this.object.shadow.camera.top = 100;
        this.object.shadow.camera.bottom = -100;
        this.object.position.set(20, 100, 10);
    }


        //if you want the lights to do any change every frame. When update is called in the scene manager, each subject's
        //update will be called. This light, if rendered first, which it is, currently, will affect every other object
        update(time) {
            /*light.intensity = (Math.sin(time)+1.5)/1.5;
            light.color.setHSL( Math.sin(time), 0.5, 0.5 );
            */
        }




}