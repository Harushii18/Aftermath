function House(scene) {
  //load house model form blender file
    const loader = new THREE.GLTFLoader();
        loader.setPath('../models/');
        loader.load('Aftermath_Map.glb', (gltf) => {
          gltf.scene.traverse(c => {
            c.castShadow = true;
          });
          scene.add(gltf.scene);
        });
	this.update = function(time) {
       //do nothing
	}

}