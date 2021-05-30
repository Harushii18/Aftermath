export class CollisionsManager {
constructor(){
  this.CollidableObjects = [];
}

addObject(object) {
  //The return3DObject method needs to exist in the object's class
    this.CollidableObjects.push(object.return3DObject());
}


returnObjects(){
  return this.CollidableObjects;
}


}
