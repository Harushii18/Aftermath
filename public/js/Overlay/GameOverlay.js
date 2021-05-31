import * as THREE from '../../jsm/three.module.js';
import { mainChar } from '../managers/SceneManager.js';

class GameOverlay extends THREE.Object3D {
    constructor() {
        super();
         this.overlay = document.getElementsByClassName("gameIconBottom");

         /*
        this.object = new THREE.Object3D();
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        /*
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('../textures/');

        const textureCube = loader.load([
            'E.png', 'concrete.png',
            'concrete.png', 'concrete.png',
            'concrete.png', 'concrete.png'
        ]);

        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube });
        
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh(geometry, material);
        this.object.add(cube);
        this.object.scale.x = 2;
        this.object.scale.y = 2;
        this.object.scale.z = 1;
        this.object.position.set(0, 20, 0);

     
*/

        this.update = function (time) {


            //Do nothing

        };
    }


    showOverlay(x,y,z) {
       
       // this.object.rotateY(rotation);

     
        console.log('show me');
        for (let i = 0; i < this.overlay.length; i++) {
            this.overlay[i].style.display = 'inline-block';
        }
      
    }

   

    changeText(newText) {
        //   document.getElementsByClassName("gameIconBottomOverlayText")[i].textContent = newText ;
    }

    createDiv(newText) {
        /*
                var elem = document.createElement('div');
                var container = document.getElementById('gameBottom');
                elem.style.display='flex';
                container.appendChild(elem);
                elem.innerHTML = newText;
                */
    }



    hideOverlay() {
       
        for (let i = 0; i < this.overlay.length; i++) {
            this.overlay[i].style.display = 'none';
        }
       
    }
}

export var gameOverlay=new GameOverlay();
