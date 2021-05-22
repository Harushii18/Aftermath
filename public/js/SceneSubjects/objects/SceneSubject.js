  
class SceneSubject {
	constructor(scene) {

		const radius = 2;
		const mesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(radius, 2), new THREE.MeshStandardMaterial({ flatShading: true }));

		mesh.position.set(0, 0, -20);
		//we can add as many items as we want to this scene
		scene.add(mesh);

		//this animates whatever is inside here- updates it upon frame
		this.update = function (time) {
			const scale = Math.sin(time) + 2;

			mesh.scale.set(scale, scale, scale);
		};


	}
}