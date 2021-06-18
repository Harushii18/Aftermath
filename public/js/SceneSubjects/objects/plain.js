import * as THREE from '../../../jsm/three.module.js';

export class Plain extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        const geometry = new THREE.PlaneGeometry( 100, 100 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        
        plane.position.y -= 2;
        plane.rotation.x = Math.PI/2;


        plane.castShadow =true;
        plane.receiveShadow = true;

        this.object.add(plane);
        
    }



    update(time) {


    }
}