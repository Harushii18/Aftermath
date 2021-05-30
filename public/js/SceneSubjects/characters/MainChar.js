import { characterControls } from '../../managers/CharacterControls.js';
import * as THREE from '../../../jsm/three.module.js';
import { FBXLoader } from '../../../jsm/FBXLoader/FBXLoader.js';

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

		this.currAction;

		this.loadModel();

		this.update = function (time) {

			//animation
			if (this.walkMixer) {
				this.determineAnimations();
				this.walkMixer.update(this.clock.getDelta());
			}

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


			//move character
			this.move();

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
			//if he is not moving, load the idle animation
			this.loadAnim('idle', '../models/characters/Animations/', 'Idle.fbx');
		} else if (characterControls.getRun()) {
			//if he is running, load the running animations
			//each if statement depends on what direction he's moving in- he can move in 8 possible directions
			if (characterControls.getMovingState() == 'back') {
				this.loadAnim('runBack', '../models/characters/Animations/Run/', 'RunBack.fbx');
			} else if (characterControls.getMovingState() == 'backLeft') {
				this.loadAnim('runBackLeft', '../models/characters/Animations/Run/', 'RunBackLeft.fbx');
			} else if (characterControls.getMovingState() == 'backRight') {
				this.loadAnim('runBackRight', '../models/characters/Animations/Run/', 'RunBackRight.fbx');
			} else if (characterControls.getMovingState() == 'forward') {
				this.loadAnim('runForward', '../models/characters/Animations/Run/', 'RunForward.fbx');
			} else if (characterControls.getMovingState() == 'forwardLeft') {
				this.loadAnim('runForwardLeft', '../models/characters/Animations/Run/', 'RunForwardLeft.fbx');
			} else if (characterControls.getMovingState() == 'forwardRight') {
				this.loadAnim('runForwardRight', '../models/characters/Animations/Run/', 'RunForwardRight.fbx');
			} else if (characterControls.getMovingState() == 'left') {
				this.loadAnim('runLeft', '../models/characters/Animations/Run/', 'RunLeft.fbx');
			} else if (characterControls.getMovingState() == 'right') {
				this.loadAnim('runRight', '../models/characters/Animations/Run/', 'RunRight.fbx');
			}
		} else {
			//if he is walking, load the walking animations
			//each if statement depends on what direction he's moving in- he can move in 8 possible directions
			if (characterControls.getMovingState() == 'back') {
				this.loadAnim('walkBack', '../models/characters/Animations/Walk/', 'BackWalk.fbx');
			} else if (characterControls.getMovingState() == 'backLeft') {
				this.loadAnim('walkBackLeft', '../models/characters/Animations/Walk/', 'backWalkL.fbx');
			} else if (characterControls.getMovingState() == 'backRight') {
				this.loadAnim('walkBackRight', '../models/characters/Animations/Walk/', 'backWalkR.fbx');
			} else if (characterControls.getMovingState() == 'forward') {
				this.loadAnim('walkForward', '../models/characters/Animations/Walk/', 'ForwardWalk.fbx');
			} else if (characterControls.getMovingState() == 'forwardLeft') {
				this.loadAnim('walkForwardLeft', '../models/characters/Animations/Walk/', 'WalkForwardLeft.fbx');
			} else if (characterControls.getMovingState() == 'forwardRight') {
				this.loadAnim('walkForwardRight', '../models/characters/Animations/Walk/', 'WalkForwardRight.fbx');
			} else if (characterControls.getMovingState() == 'left') {
				this.loadAnim('walkLeft', '../models/characters/Animations/Walk/', 'LeftWalk.fbx');
			} else if (characterControls.getMovingState() == 'right') {
				this.loadAnim('walkRight', '../models/characters/Animations/Walk/', 'RightWalk.fbx');
			}
		}

	}

	loadAnim(state, path, file) {
		if (!characterControls.checkAnimState(state)) {
			//if he is not currently doing this animation, set the animation state to this new animation
			characterControls.setAnimState(state);
			//this.walkMixer.stopAllAction();

			//load the animation
			const anim = new FBXLoader();
			anim.setPath(path);
			anim.load(file, (anim) => {
				//make the walkMixer do this action
				this.moveAnim = this.walkMixer.clipAction(anim.animations[0]);
				this.moveAnim.reset();

				//this.idle.setLoop(THREE.LoopOnce, 1);
				this.moveAnim.clampWhenFinished = true;

				//cross fade from the previous animation
				this.moveAnim.crossFadeFrom(this.currAction, 0.2, true);
				this.currAction = this.moveAnim;

				//play the loaded animation
				this.moveAnim.play();
			});
		}
	}

	loadModel() {
		//load the main character model with an FBX Loader
		const loader = new FBXLoader();
		loader.setPath('../models/characters/');
		loader.load('Douglas.fbx', (fbx) => {
			//scale the model down
			fbx.scale.setScalar(0.0115);
			fbx.traverse(c => {
				c.castShadow = true;
				c.receiveShadow=true;
			});


			//animate character
			const anim = new FBXLoader();
			anim.setPath('../models/characters/Animations/');
			anim.load('Idle.fbx', (anim) => {

				this.walkMixer = new THREE.AnimationMixer(fbx);

				//set the initial animation for our main character to be idle (as he is not moving)
				this.idle = this.walkMixer.clipAction(anim.animations[0]);
				this.currAction = this.idle;
				this.idle.play();
			});

			this.object.add(fbx);
		});
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
