		//CODE FOR LOADING GLTF FILES
		/*
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
		*/


		
			//var rotateAngle = Math.PI / 2 * 0.05;

			// FOR CAMERA ROTATIONS
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
			//var rotation_matrix = new THREE.Matrix4().identity();

				/*
						//Rotations
						//var rotation_matrix = new THREE.Matrix4().identity();
						if (this.keyboard.pressed("A"))
						this.object.translateX(moveDistance);
							//this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle * 0.2);
			*/