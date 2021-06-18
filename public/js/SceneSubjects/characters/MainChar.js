import { characterControls } from '../../managers/CharacterControls.js';
import * as THREE from '../../../jsm/three.module.js';
import { FBXLoader } from '../../../jsm/FBXLoader/FBXLoader.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';
import { gameInstructions } from '../../Overlay/GameInstructions.js';
import { loadedHouse } from '../House.js';
//import { loadingManager } from '../../managers/SceneManager.js';

export class MainChar extends THREE.Object3D {

	constructor(collidableObjects, loadingManager, womanModel) {


		super();

		this.loadingManager = loadingManager;
		this.collidableObjects = collidableObjects;
		this.collidableWoman = womanModel;


		this.loaded = false;
		//main character object
		this.object = new THREE.Object3D();
		this.clock = new THREE.Clock();
		this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI);
		// //spawn outside house
		// this.object.position.set(0, 1, -50);

//SET TO TRUE FOR NOW
		this.allowAttack = false;
		this.hasFlashlight = false;

		//start from scratch-> char at original starting game position
		this.object.position.set(0, 1, 50);

		this.object.visible = false; //Uncomment this so you don't see the player in first person view
		this.initialiseSubtitleContents();

		//this.object.castShadow = true;





		//change the below to 8 to scale him to the correct scale
		this.object.scale.x = 8;
		this.object.scale.y = 8;
		this.object.scale.z = 8;

		this.currAction;

		this.loadModel();

		//make sure animations are pre-loaded
		this.anim = {};
		this.loadAllAnimations();

		this.update = function (time) {
			//perform everything only if the game has loaded
			if (this.loaded && loadedHouse) {


				//add subtitles
				this.addSubtitles();


				//if the second subtitle has finished
				if (this.subtitleState.t2) {
					//add game instructions on side of screen
					gameInstructions.checkTime();

				}

				//ensure that all movement is not by frame rate
				this.delta = this.clock.getDelta();


				//animation
				if (this.walkMixer) {
					this.determineAnimations();
					this.walkMixer.update(this.delta);
				}

				const pos = this.object.position.clone();
				let dir = new THREE.Vector3();
				this.object.getWorldDirection(dir);
				//pos.y += 60;


				//Direction of raycasters
				let forwardDirection = new THREE.Vector3(dir.x, dir.y, dir.z);
				let backwardDirection = new THREE.Vector3(dir.x, dir.y, -dir.z);
				let rightDirection = new THREE.Vector3(-dir.x, dir.y, dir.z);
				let leftDirection = new THREE.Vector3(dir.x, dir.y, dir.z);

				let topRightDirection = new THREE.Vector3(dir.x*0.5, dir.y, dir.z*0.5);
				let topLeftDirection = new THREE.Vector3(dir.x*0.5, dir.y, -dir.z*0.5);
				let bottomRightDirection = new THREE.Vector3(-dir.x*0.5, dir.y, dir.z*0.5);
				let bottomLeftDirection = new THREE.Vector3(dir.x*0.5, dir.y, dir.z*0.5);


				//Raycasting to detect collisions with house object
				let forwardRaycaster = new THREE.Raycaster(pos, forwardDirection);
				let backwardRaycaster = new THREE.Raycaster(pos, backwardDirection);
				let rightRaycaster = new THREE.Raycaster(pos, rightDirection);
				let leftRaycaster = new THREE.Raycaster(pos, leftDirection);

				let topRightRaycaster = new THREE.Raycaster(pos, topRightDirection);
				let topLeftRaycaster = new THREE.Raycaster(pos, topLeftDirection);
				let bottomRightRaycaster = new THREE.Raycaster(pos, bottomRightDirection);
				let bottomLeftRaycaster = new THREE.Raycaster(pos, bottomLeftDirection);








				//Boolean variables representing collision
				let blockedF = false;//Blocked forward
				let blockedB = false;//Blocked backward
				let blockedR = false;//Blocked right
				let blockedL = false;//Blocked left

				let blockedTR = false;//Blocked forward
				let blockedTL = false;//Blocked backward
				let blockedBR = false;//Blocked right
				let blockedBL = false;//Blocked left




				//Check forward intersections
				blockedF = this.checkIntersections(blockedF, forwardRaycaster);

				//Check backward intersections
				blockedB = this.checkIntersections(blockedB, backwardRaycaster);

				//Check right intersections
				blockedR = this.checkIntersections(blockedR, rightRaycaster);

				//Check left intersections
				blockedL = this.checkIntersections(blockedL, leftRaycaster);



				//Check top right intersections
				blockedTR = this.checkIntersections(blockedTR, topRightRaycaster);
				//Check top left intersections
				blockedTL = this.checkIntersections(blockedTL, topLeftRaycaster);
				//Check bottom right intersections
				blockedBR = this.checkIntersections(blockedBR, bottomRightRaycaster);
				//Check bottom left intersections
				blockedBL = this.checkIntersections(blockedBL, bottomLeftRaycaster);

				//Player movement
				this.move(blockedF, blockedB, blockedR, blockedL, blockedTR, blockedTL, blockedBR, blockedBL);


				/*Note: Because the scene is warped due to the Perspective Camera, sometimes the ray (from the raycaster) doesn't detect the collision
				because the angle between the camera and the collidable object is not orthogonal. Eg. if the wall/object is parallel to the direction
				that the camera faces, walking right/left will result in a collision, but any other angle to the
				wall/object doesn't result in a collision. */

			}
		};
	}

	//====================SUBTITLES========================================
	initialiseSubtitleContents() {
		//Checks if the subtitle had started showing
		this.subtitleStarted = {
			t1: false,
			t2: false
		};
		//Checks if the subtitle had been shown already
		this.subtitleState = {
			t1: false,
			t2: false
		};
		//Contains the text for each subtitle
		this.subtitleText = {
			t1: "I heard a sound by the painting",
			t2: "I think I should check it out"
		};
	}

	setLoaded(loaded)
	{
		this.loaded = loaded;
	}
	addSubtitles() {

		//t1
		if (!this.subtitleState.t1) {
			subtitleManager.showSubtitles();
			if (!this.subtitleStarted.t1) {
				//start showing the subtitle
				subtitleManager.startTime();
				subtitleManager.setDuration(8);
				subtitleManager.changeSubtitlesText(this.subtitleText.t1);
				this.subtitleStarted.t1 = true;
			}

			subtitleManager.countTime();
			if (!subtitleManager.checkTime()) {
				this.subtitleState.t1 = true;
				//meaning it was shown
			}
		}

		//show t2
		if (this.subtitleState.t1) {
			if (!this.subtitleState.t2) {
				subtitleManager.showSubtitles();
				if (!this.subtitleStarted.t2) {
					//start showing the subtitle
					subtitleManager.startTime();
					subtitleManager.setDuration(5);
					subtitleManager.changeSubtitlesText(this.subtitleText.t2);
					this.subtitleStarted.t2 = true;
				}

				subtitleManager.countTime();
				if (!subtitleManager.checkTime()) {
					this.subtitleState.t2 = true;
					//meaning it was shown
				}
			}

		}

	}


	//=============RAYCASTER AND CAMERA==============================================================


	//Check intersections of a raycaster with collidable objects
	checkForWoman(blocked, raycaster) {
		const intersect = raycaster.intersectObject(this.collidableWoman, true);
		if (intersect.length > 0) {
			if (intersect[0].distance < 30) {
				blocked = true;
			}
		}
		return blocked;
	}

	//Check intersections of a raycaster with collidable objects
	checkIntersections(blocked, raycaster) {
		const intersect = raycaster.intersectObjects(this.collidableObjects, true);
		if (intersect.length > 0) {
			if (intersect[0].distance < 3) {
				//console.log("Collision");
				blocked = true;
			}
		}
		return blocked;
	}


	updateDirection(directionVector) {
		this.object.lookAt(directionVector.x + this.object.position.x, this.object.position.y, directionVector.z + this.object.position.z);
	}

	//Return the position of the object in the world
	returnWorldPosition() {
		let worldPos = new THREE.Vector3();
		this.object.getWorldPosition(worldPos);
		return worldPos;
	}

	//Return the direction that the character  is facing
	returnObjectDirection() {
		return this.object.rotation;
	}



	setVisibility(visibility) {
		this.object.visible = visibility;
	}

	setName(name) {
		this.object.name = name;
	}

	//==========================MOVEMENT ANIMATIONS=================================================

	loadAllAnimations() {
		var runPath = './models/characters/Animations/Run/';
		var walkPath = './models/characters/Animations/Walk/';
		//idle
		this.loadAnim('idle', './models/characters/Animations/', 'Idle.fbx');
		//RunBack
		this.loadAnim('runBack', runPath, 'RunBack.fbx');
		//RunBackLeft
		this.loadAnim('runBackLeft', runPath, 'RunBackLeft.fbx');
		//RunBackRight
		this.loadAnim('runBackRight', runPath, 'RunBackRight.fbx');
		//RunForward
		this.loadAnim('runForward', runPath, 'RunForward.fbx');
		//RunForwardLeft
		this.loadAnim('runForwardLeft', runPath, 'RunForwardLeft.fbx');
		//RunForwardRight
		this.loadAnim('runForwardRight', runPath, 'RunForwardRight.fbx');
		//RunLeft
		this.loadAnim('runLeft', runPath, 'RunLeft.fbx');
		//RunRight
		this.loadAnim('runRight', runPath, 'RunRight.fbx');
		//BackWalk
		this.loadAnim('walkBack', walkPath, 'BackWalk.fbx');
		//backWalkL
		this.loadAnim('walkBackLeft', walkPath, 'backWalkL.fbx');
		//backWalkR
		this.loadAnim('walkBackRight', walkPath, 'backWalkR.fbx');
		//ForwardWalk
		this.loadAnim('walkForward', walkPath, 'ForwardWalk.fbx');
		//WalkForwardLeft
		this.loadAnim('walkForwardLeft', walkPath, 'WalkForwardLeft.fbx');
		//WalkForwardRight
		this.loadAnim('walkForwardRight', walkPath, 'WalkForwardRight.fbx');
		//LeftWalk
		this.loadAnim('walkLeft', walkPath, 'LeftWalk.fbx');
		//RightWalk
		this.loadAnim('walkRight', walkPath, 'RightWalk.fbx');
	}

	determineAnimations() {
		if (characterControls.checkMovement() == false) {
			//if he is not moving, load the idle animation
			this.playAnim(this.anim['idle'], 'idle');
		} else if (characterControls.getRun()) {
			//if he is running, load the running animations
			//each if statement depends on what direction he's moving in- he can move in 8 possible directions
			if (characterControls.getMovingState() == 'back') {
				this.playAnim(this.anim['runBack'], 'runBack');
			} else if (characterControls.getMovingState() == 'backLeft') {
				this.playAnim(this.anim['runBackLeft'], 'runBackLeft');
			} else if (characterControls.getMovingState() == 'backRight') {
				this.playAnim(this.anim['runBackRight'], 'runBackRight');
			} else if (characterControls.getMovingState() == 'forward') {
				this.playAnim(this.anim['runForward'], 'runForward');
			} else if (characterControls.getMovingState() == 'forwardLeft') {
				this.playAnim(this.anim['runForwardLeft'], 'runForwardLeft');
			} else if (characterControls.getMovingState() == 'forwardRight') {
				this.playAnim(this.anim['runForwardRight'], 'runForwardRight');
			} else if (characterControls.getMovingState() == 'left') {
				this.playAnim(this.anim['runLeft'], 'runLeft');
			} else if (characterControls.getMovingState() == 'right') {
				this.playAnim(this.anim['runRight'], 'runRight');
			}
		} else {
			//if he is walking, load the walking animations
			//each if statement depends on what direction he's moving in- he can move in 8 possible directions
			if (characterControls.getMovingState() == 'back') {
				this.playAnim(this.anim['walkBack'], 'walkBack');
			} else if (characterControls.getMovingState() == 'backLeft') {
				this.playAnim(this.anim['walkBackLeft'], 'walkBackLeft');
			} else if (characterControls.getMovingState() == 'backRight') {
				this.playAnim(this.anim['walkBackRight'], 'walkBackRight');
			} else if (characterControls.getMovingState() == 'forward') {
				this.playAnim(this.anim['walkForward'], 'walkForward');
			} else if (characterControls.getMovingState() == 'forwardLeft') {
				this.playAnim(this.anim['walkForwardLeft'], 'walkForwardLeft');
			} else if (characterControls.getMovingState() == 'forwardRight') {
				this.playAnim(this.anim['walkForwardRight'], 'walkForwardRight');
			} else if (characterControls.getMovingState() == 'left') {
				this.playAnim(this.anim['walkLeft'], 'walkLeft');
			} else if (characterControls.getMovingState() == 'right') {
				this.playAnim(this.anim['walkRight'], 'walkRight');
			}
		}

	}

	playAnim(animation, state) {
		if (!characterControls.checkAnimState(state)) {
			//if he is not currently doing this animation, set the animation state to this new animation
			characterControls.setAnimState(state);

			//make the walkMixer do this action
			animation = this.walkMixer.clipAction(animation.animations[0]);
			animation.reset();

			animation.clampWhenFinished = true;

			//cross fade from the previous animation
			animation.crossFadeFrom(this.currAction, 0.2, true);
			this.currAction = animation;

			//play the loaded animation
			animation.play();
		}

	}
	loadAnim(state, path, file) {
		//load the animation
		const anime = new FBXLoader(this.loadingManager);
		anime.setPath(path);
		anime.load(file, (anime) => {

			//store animation in dictionary for access later
			this.anim[state] = anime;
		});
	}

	loadModel() {
		//load the main character model with an FBX Loader
		const loader = new FBXLoader(this.loadingManager);
		loader.setPath('./models/characters/');
		loader.load('Douglas.fbx', (fbx) => {
			//scale the model down
			fbx.scale.setScalar(0.0115);
			/*fbx.traverse(c => {
				c.castShadow = true;
				c.receiveShadow = true;
			});*/



			//animate character
			const anim = new FBXLoader(this.loadingManager);
			anim.setPath('./models/characters/Animations/');
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

	setAllowAttack(value){
		this.allowAttack = value;
	}

	setHasFlashlight(value){
		this.hasFlashlight = value;
	}


	//===================PLAYER MOVEMENTS===============================================

	rotate() {
		var rotateAngle = Math.PI / 2 * this.delta;

		if (characterControls.rotateRight()) {
			this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
		}
		if (characterControls.rotateLeft()) {
			this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
		}
	}



	//Move the player
	move(blockedF, blockedB, blockedR, blockedL, blockedTR, blockedTL, blockedBR, blockedBL) {
		//moves character around
		this.moveDistance = characterControls.getSpeed() * this.delta;

		if(!blockedTR){
			//If trying to move forward
			if ((characterControls.moveForward() && characterControls.moveRight()) || (characterControls.moveRight() && characterControls.moveForward()) ) {
				this.object.translateZ(this.moveDistance);
				this.object.translateX(-this.moveDistance);
			}
		}

		if(!blockedTL){
			if (characterControls.moveForward() && characterControls.moveLeft() || (characterControls.moveLeft() && characterControls.moveForward()) ) {
				this.object.translateZ(this.moveDistance);
				this.object.translateX(this.moveDistance);
			}
		}

		if(!blockedBR){
			if (characterControls.moveBackward() && characterControls.moveRight() || (characterControls.moveRight() && characterControls.moveBackward()) ) {
				this.object.translateZ(-this.moveDistance);
				this.object.translateX(-this.moveDistance);
			}

		}

		if(!blockedBL){
			if (characterControls.moveBackward() && characterControls.moveLeft() || (characterControls.moveLeft() && characterControls.moveBackward()) ) {
				this.object.translateZ(-this.moveDistance);
				this.object.translateX(this.moveDistance);
			}
		}



		//If front of character is not blocked
		if (!blockedF) {
			//If trying to move forward
			if (characterControls.moveForward()) {
				this.object.translateZ(this.moveDistance);
			}
		}

		//If back of character is not blocked
		if (!blockedB) {
			//If trying to move backward
			if (characterControls.moveBackward()) {
				this.object.translateZ(-this.moveDistance);
			}
		}

		//If right of character is not blocked
		if (!blockedR) {
			//If trying to move right
			if (characterControls.moveRight()) {
				this.object.translateX(-this.moveDistance);
			}
		}

		//If left of character is not blocked
		if (!blockedL) {
			//If trying to move left
			if (characterControls.moveLeft()) {
				this.object.translateX(this.moveDistance);
			}
		}

		this.rotate();

	}
	//============================================================================
}
