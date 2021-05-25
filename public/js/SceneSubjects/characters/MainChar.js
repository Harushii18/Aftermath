class MainChar extends THREE.Object3D {
	constructor() {
		super();
	    this.object = new THREE.Object3D();
	    this.clock=new THREE.Clock();
		//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -Math.PI);
		this.object.position.set(0, 1, 50);

		//change the below to 8 to scale him to the correct scale
		this.object.scale.x=8;
		this.object.scale.y=8;
		this.object.scale.z=8;
		this.moveDistance = 0.5 ; 
		this.mixers=[]


		
	//save keyboard bindings
	//this.keyboard = new THREEx.KeyboardState();
	
		const loader = new THREE.GLTFLoader();
   		loader.setPath('../../models/characters/');
    
  		var gltf = loader.load('walk.glb', (gltf) => {
			gltf.scene.traverse(c => {
				c.castShadow = true;
				
			});
			this.idleMixer = new THREE.AnimationMixer( gltf.scene );
			this.idleMixer.timeScale=1;
			this.mixers.push(this.idleMixer)
			var idle = this.idleMixer.clipAction( gltf.animations[ 0 ] );
			idle.play();

			this.object.add( gltf.scene );
    	});
	

	
		
		this.update = function (time) {

			//animation
			if ( this.idleMixer ){
			 this.idleMixer.update( this.clock.getDelta() );
			}


			//var rotateAngle = Math.PI / 2 * 0.05;   
			// move forwards/backwards/left/right

	
		
			// FOR CAMERA ROTATIONS
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
			//var rotation_matrix = new THREE.Matrix4().identity();
			
			
		
				
			/*
			// global coordinates
			if (  this.keyboard.pressed("left") )
			this.object.position.x -= moveDistance;
			if (  this.keyboard.pressed("right") )
			this.object.position.x += moveDistance;
			if (  this.keyboard.pressed("up") )
			this.object.position.z -= moveDistance;
			if (  this.keyboard.pressed("down") )
			this.object.position.z += moveDistance;
			*/

		};
	}
	/*
	performMovement(){
		var object=this.scene.getObjectByName('Douglas');
		if (keyboardManager.movements.left){
			object.translateX(-this.moveDistance);
		}
		if (keyboardManager.movements.right){
			object.translateX(this.moveDistance);   
		}
		if (keyboardManager.movements.backward){
			object.translateZ(this.moveDistance);
		}
		if (keyboardManager.movements.forward){
			object.translateZ(-this.moveDistance);
		}
	}
	*/
	setName(name){
		this.object.name=name;
	}


	resetChar(){
		this.object.position.set(0, 1, 50);
		this.object.rotation.set(0,0,0);
	}

}
