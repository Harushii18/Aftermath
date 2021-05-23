class House extends THREE.Object3D{
  constructor() {

    super();
    this.object = new THREE.Object3D();
    //load house model form blender file

    const loader = new THREE.GLTFLoader();
    loader.setPath('../models/');
    
    const gltf = loader.load('Aftermath_Map.glb', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });
      this.object.add( gltf.scene);
    });

   

  }
    update(time) {
      //do nothing
    }
}