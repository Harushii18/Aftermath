  
class GeneralLights {
    constructor(scene) {

        const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);

        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;


        light.position.set(20, 100, 10);

        scene.add(light);


        //if you want the lights to do any change every frame. When update is called in the scene manager, each subject's
        //update will be called. This light, if rendered first, which it is, currently, will affect every other object
        this.update = function (time) {
            /*light.intensity = (Math.sin(time)+1.5)/1.5;
            light.color.setHSL( Math.sin(time), 0.5, 0.5 );
            */
        };



    }
}