import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { loadingManager, mainChar, hudOverlayRemoveQueue } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';
import { Plank } from './Plank.js';

export class Boards extends THREE.Object3D {


    constructor() {
        super();
        this.object = new THREE.Object3D();

        this.plank = new Plank();
        this.plank1 = new Plank();
        this.plank2 = new Plank();


        this.plank.setPosition(0, 5,0);
        this.plank.setRotation(Math.PI / 2)

        this.plank1.setPosition(0, 0, 0);
        this.plank1.setRotation(Math.PI / 2);

        this.plank2.setPosition(0, -5, 0);
        this.plank2.setRotation(Math.PI / 2);

        this.object.add(this.plank.object);
        this.object.add(this.plank1.object);
        this.object.add(this.plank2.object);





    }

    //checks if Character is in vicinity of drawer to open/ close it

    update()
    {

    }
  
}
