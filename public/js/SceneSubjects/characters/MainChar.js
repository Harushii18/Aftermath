
class MainChar extends THREE.Object3D {
	constructor() {
		//load a model asnd animate it
		//TODO!
		super();
	   this.object = new THREE.Object3D();
		this.object.position.set(0, 1, 50);
		this.object.scale.x=5;
		this.object.scale.y=20;
		this.object.scale.z=5;
		const loader = new FBXLoader();
		loader.setPath('../../models/characters/');
		loader.load('Douglas.fbx', (fbx) => {
		 
		  fbx.scene.traverse(c => {
			c.castShadow = true;
		  });
		  this.object.add(fbx);
		});
	

		//save keyboard bindings
		this.keyboard = new THREEx.KeyboardState();
		/*
		//creating a box (need to change it to a character with animations)
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		this.object = new THREE.Mesh( geometry, material );
		
		this.object.scale.x=5;
		this.object.scale.y=10;
		this.object.scale.z=5;
			//starting position for character
		this.object.position.set(0, 10, 50);

		*/
		
	

		
		this.update = function (time) {

			//MOVEMENT OF BOX

			//speed
			var moveDistance = 0.5 ; 
			var rotateAngle = Math.PI / 2 * 0.05;   
			
			// move forwards/backwards/left/right
			if ( this.keyboard.pressed("W") ){
				this.object.translateZ( -moveDistance );
		    }
			if (  this.keyboard.pressed("S") ){
				this.object.translateZ(  moveDistance );
			}
			if (  this.keyboard.pressed("A") ){
				this.object.translateX( -moveDistance );
			}
			if (  this.keyboard.pressed("D") ){
				this.object.translateX( moveDistance );
			}

			// move forwards/backwards/left/right
			if ( this.keyboard.pressed("up") ){
				this.object.translateZ( -moveDistance );
			}
			if (  this.keyboard.pressed("down") ){
				this.object.translateZ(  moveDistance );
			}
			if (  this.keyboard.pressed("left") ){
				this.object.translateX( -moveDistance );
			}
			if (  this.keyboard.pressed("right") ){
				this.object.translateX( moveDistance );
			}
			
		
			// FOR CAMERA ROTATIONS
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
			//this.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
			//var rotation_matrix = new THREE.Matrix4().identity();
			
			
			if (  this.keyboard.pressed("Z") )
			{
				this.object.position.set(0, 1, 50);
				this.object.rotation.set(0,0,0);
			}
				
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
}
