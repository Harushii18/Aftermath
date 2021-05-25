 class MainChar extends THREE.Object3D {
	constructor(houseObject) {
		//load a model and animate it
		//TODO!

		super();
    this.houseObject = houseObject.return3DObject();


	/*	this.object = new THREE.Object3D();
		this.object.position.set(0, 1, 50);
		this.object.scale.x=5;
		this.object.scale.y=20;
		this.object.scale.z=5;
		const loader = new FBXLoader();
		loader.setPath('../../models/characters');
		loader.load('Douglas.fbx', (fbx) => {

		  fbx.scene.traverse(c => {
			c.castShadow = true;
		  });
		  this.object.add(fbx);
		});

	*/
		//save keyboard bindings
		this.keyboard = new THREEx.KeyboardState();
		//creating a box (need to change it to a character with animations)
		const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		this.object = new THREE.Mesh( geometry, material );

		this.object.scale.x=5;
		this.object.scale.y=10;
		this.object.scale.z=5;
		this.object.position.set(0, 5, 50);
		this.keyboard = new THREEx.KeyboardState();
		//starting position for character

    //Creating the player camera




		this.update = function (time) {
      //MOVEMENT OF BOX

			//speed
			var moveDistance = 0.1 ;
			var rotateAngle = Math.PI / 2 * 0.05;

      const pos = this.object.position.clone();
      let dir = new THREE.Vector3();
      this.object.getWorldDirection(dir);
      //pos.y += 60;

      //Raycasting to detect collisions with house object
      let raycaster = new THREE.Raycaster(pos,dir);
      //raycaster.set(pos,dir);
      let blocked = false;

      const intersect = raycaster.intersectObject( this.houseObject );
      if(intersect.length>0){
        if(intersect[0].distance<50){
          blocked = true;
        }
      }

      if(!blocked){
        // move forwards/backwards/left/right
        if ( this.keyboard.pressed("W") )
          this.object.translateZ( -moveDistance );
  			if (  this.keyboard.pressed("S") )
  			   this.object.translateZ(  moveDistance );
  			if (  this.keyboard.pressed("Q") )
  			   this.object.translateX( -moveDistance );
  			if (  this.keyboard.pressed("E") )
  			   this.object.translateX(  moveDistance );
      }





			//Rotations
			//var rotation_matrix = new THREE.Matrix4().identity();
			if (  this.keyboard.pressed("A") )
			this.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle*0.2);
			if (  this.keyboard.pressed("D") )
			this.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle*0.2);

			if (  this.keyboard.pressed("Z") )
			{
				this.object.position.set(0, 1, 50);
				this.object.rotation.set(0,0,0);
			}



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


}
