
class SceneSubject extends THREE.Object3D {


	constructor() {
		super();
		const radius = 2;
		this.object = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(radius, 2), new THREE.MeshStandardMaterial({ flatShading: true }));

		this.object.position.set(0, 0, -20);
		//we can add as many items as we want to this scene


		//this animates whatever is inside here- updates it upon frame

	}

	update(time) {
		const scale = Math.sin(time) + 2;

		this.object.scale.set(scale, scale, scale);
	}

  return3DObject(){
   return this.object;
  }


}
