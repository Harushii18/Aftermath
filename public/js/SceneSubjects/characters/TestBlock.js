export class TestBlock extends THREE.Object3D {
  constructor() {
    //load a model and animate it
    //TODO!

    super();

    //creating a box (need to change it to a character with animations)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.object = new THREE.Mesh(geometry, material);

    this.object.scale.x = 5;
    this.object.scale.y = 10;
    this.object.scale.z = 5;
    this.object.position.set(0, 5, -40);
    //this.keyboard = new THREEx.KeyboardState();
    //starting position for character

    //Creating the player camera




    this.update = function (time) {
      //Do nothing

    };
  }
  return3DObject() {
    return this.object;
  }

}
