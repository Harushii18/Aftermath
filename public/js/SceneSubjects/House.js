class House extends THREE.Object3D{
  constructor() {
    //load house model form blender file

    const loader = new THREE.GLTFLoader();
    loader.setPath('../models/');
    var house = new THREE.Object3D();
    const gltf = loader.load('Aftermath_Map.glb', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });
      house.add( gltf.scene);
    });

    return house;
  }
    update(time) {
      //do nothing
    };
}