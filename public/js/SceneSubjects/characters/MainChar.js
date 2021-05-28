import { characterControls } from '../../managers/CharacterControls.js';
import * as THREE from '../../../jsm/three.module.js';
import { FBXLoader } from '../../../jsm/FBXLoader/FBXLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';
//import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
export class MainChar extends THREE.Object3D {
	constructor(houseObject) {
		super();
		this.houseObject = houseObject.return3DObject();
		//main character object
		this.object = new THREE.Object3D();
		this.clock = new THREE.Clock();

		this.object.position.set(0, 1, 50);
		//	this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -Math.PI);
		//change the below to 8 to scale him to the correct scale
		this.object.scale.x = 8;
		this.object.scale.y = 8;
		this.object.scale.z = 8;



		this.mixers = []

		this.currAction;
		this.loadModel();

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




		this.update = function (time) {

			//animation
			if (this.walkMixer) {
				this.determineAnimations();
				this.walkMixer.update(this.clock.getDelta());
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
			//determine animations


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

	determineAnimations() {

		if (characterControls.checkMovement() == false) {
			//if he doesn't move, play idle animation
			if (!characterControls.checkAnimState('idle')) {
				this.getCurrAction();
				characterControls.setAnimState('idle');


				//this.walkMixer.stopAllAction();

				const anim = new FBXLoader();
				anim.setPath('../models/characters/Animations/');
				anim.load('Idle.fbx', (anim) => {
					//creates animation action
					this.idle = this.walkMixer.clipAction(anim.animations[0]);
					this.idle.reset();
					//this.idle.setLoop(THREE.LoopOnce, 1);
					this.idle.clampWhenFinished = true;
					this.idle.crossFadeFrom(this.currAction, 0.2, true);

					this.idle.play();
				});
			}
		} else if (characterControls.getRun()) {
			//if he doesn't move, play run animation
			if (!characterControls.checkAnimState('run')) {
				this.getCurrAction();
				characterControls.setAnimState('run');


				//this.walkMixer.stopAllAction();

				const anim = new FBXLoader();
				anim.setPath('../models/characters/Animations/');
				anim.load('Run.fbx', (anim) => {
					//creates animation action
					this.run = this.walkMixer.clipAction(anim.animations[0]);
					this.run.reset();
					//this.idle.setLoop(THREE.LoopOnce, 1);
					this.run.clampWhenFinished = true;
					this.run.crossFadeFrom(this.currAction, 0.2, true);

					this.run.play();
				});
			}
		} else {
			//if he doesn't move, play walk animation
			if (!characterControls.checkAnimState('walk')) {
				this.getCurrAction();
				characterControls.setAnimState('walk');


				//this.walkMixer.stopAllAction();

				const anim = new FBXLoader();
				anim.setPath('../models/characters/Animations/');
				anim.load('Walk.fbx', (anim) => {
					//create animation action
					this.walk = this.walkMixer.clipAction(anim.animations[0]);
					//	this.mixers.push(this.walk);
					this.walk.reset();
					//this.idle.setLoop(THREE.LoopOnce, 1);
					this.walk.clampWhenFinished = true;
					this.walk.crossFadeFrom(this.currAction, 0.2, true);

					this.walk.play();
				});

			}
		}
	}

	getCurrAction() {
		if (characterControls.checkAnimState('idle')) {
			this.currAction = this.idle;
		}
		else if (characterControls.checkAnimState('run')) {
			this.currAction = this.run;

		} else if (characterControls.checkAnimState('walk')) {
			this.currAction = this.walk;

		}
	}
	loadModel() {

		const loader = new FBXLoader();
		//load model
		loader.setPath('../models/characters/');
		loader.load('Douglas.fbx', (fbx) => {
			//scale the model down
			fbx.scale.setScalar(0.0115);
			fbx.traverse(c => {
				c.castShadow = true;
			});


			//animate character
			const anim = new FBXLoader();
			anim.setPath('../models/characters/Animations/');
			anim.load('Idle.fbx', (anim) => {

				this.walkMixer = new THREE.AnimationMixer(fbx);

				//creates animation action
				this.idle = this.walkMixer.clipAction(anim.animations[0]);
				this.currAction = this.idle;
				this.idle.play();
			});

			//this.object.scale(1,-1,1);
			this.object.add(fbx);
		});
		/*
		
		
				const loader = new FBXLoader();
				//load model
				loader.setPath('../models/characters/Animations/');
				loader.load('Walking(2).fbx', (fbx) => {
					//scale the model down
					fbx.scale.setScalar(0.0115);
		
		
		
					this.walkMixer = new THREE.AnimationMixer(fbx);
		
					//creates animation action
					const walk = this.walkMixer.clipAction(fbx.animations[0]);
					walk.play();
					this.object.add(fbx);
				});
				*/


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
