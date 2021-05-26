import { characterControls } from '../../managers/CharacterControls.js';
export class MainChar extends THREE.Object3D {
	constructor(houseObject) {
		super();
		this.houseObject = houseObject.return3DObject();
		//main character object
		this.object = new THREE.Object3D();
		this.clock = new THREE.Clock();
		//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -Math.PI);
		this.object.position.set(0, 1, 50);

		//change the below to 8 to scale him to the correct scale
		this.object.scale.x = 8;
		this.object.scale.y = 8;
		this.object.scale.z = 8;



		this.mixers = []

		const loader = new THREE.GLTFLoader();
		loader.setPath('../../models/characters/');

		var gltf = loader.load('walk.glb', (gltf) => {
			gltf.scene.traverse(c => {
				c.castShadow = true;

			});
			this.idleMixer = new THREE.AnimationMixer(gltf.scene);
			this.idleMixer.timeScale = 1;
			this.mixers.push(this.idleMixer)
			var idle = this.idleMixer.clipAction(gltf.animations[0]);
			idle.play();

			this.object.add(gltf.scene);
		});




		this.update = function (time) {

			//animation
			if (this.idleMixer) {
				this.idleMixer.update(this.clock.getDelta());
			}


			//var rotateAngle = Math.PI / 2 * 0.05;   




			// FOR CAMERA ROTATIONS
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
			//var rotation_matrix = new THREE.Matrix4().identity();

			var rotateAngle = Math.PI / 2 * 0.05;

			const pos = this.object.position.clone();
			let dir = new THREE.Vector3();
			this.object.getWorldDirection(dir);
			//pos.y += 60;

			//Raycasting to detect collisions with house object
			let raycaster = new THREE.Raycaster(pos, dir);
			//raycaster.set(pos,dir);
			let blocked = false;

			const intersect = raycaster.intersectObject(this.houseObject);
			if (intersect.length > 0) {
				if (intersect[0].distance < 50) {
					blocked = true;
				}
			}

			/*if (!blocked) {
				
				
			}*/
			//MOVE THE CODE BELOW TO INSIDE IF STATEMENT WHEN RAYCASTER IS FIXED
			//move Character
			this.move();

			/*
			
			
						//Rotations
						//var rotation_matrix = new THREE.Matrix4().identity();
						if (this.keyboard.pressed("A"))
						this.object.translateX(moveDistance);   
							//this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle * 0.2);
			*/

		};
	}

	//Return the direction that the character  is facing
	returnObjectDirection() {
		return this.object.rotation;
	}

	//Return the position of the object in the world
	returnWorldPosition() {
		let worldPos = new THREE.Vector3();
		this.object.getWorldPosition(worldPos);
		return worldPos;
	}

	setName(name) {
		this.object.name = name;
	}


	resetChar() {
		this.object.position.set(0, 1, 50);
		this.object.rotation.set(0, 0, 0);
	}


	move() {
		this.moveDistance = characterControls.getSpeed();
		//moves character around
		if (characterControls.moveForward()) {
			this.object.translateZ(-this.moveDistance);
		}
		if (characterControls.moveBackward()) {
			this.object.translateZ(this.moveDistance);
		}
		if (characterControls.moveLeft()) {
			this.object.translateX(-this.moveDistance);
		}
		if (characterControls.moveRight()) {
			this.object.translateX(this.moveDistance);
		}
	}
}
