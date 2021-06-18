import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { loadingManager, mainChar, hudOverlayRemoveQueue } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';


export class Keypad extends THREE.Object3D {


    constructor() {
        super();
        this.objectInteractionCounter = 0;
        this.object = new THREE.Object3D();

        //initialise subtitle contents
        this.initialiseSubtitleContents();

        //stores a variable that only allows the interaction overlay to be shown once
        this.count = 0;

        //variable to start subtitles
        this.startSubtitles = false;
        this.showNoKeySubtitles = false;


        this.doCheckVicinity = true;
        //we change this to true when the other events have been allowed
        this.allowInteraction = false;

        this.clock = new THREE.Clock();
        const loader = new GLTFLoader(loadingManager);

        loader.setPath('../../models/3DObjects/');

        this.open = false; //keeps track if the drawer is openend




        var gltf = loader.load('keypad.glb', (gltf) => {
            //console.log("loaded drawer");
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });



            var obj_gltf = new THREE.Object3D();

           

            


            obj_gltf.add(gltf.scene);
            this.object.add(obj_gltf);
        });

    }

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
     
    }

    setAllowInteraction(value) {
        this.allowInteraction = value;
    }



    update(time) {

       

    }

    setForScene()
    {

        this.object.scale.x = 1.5;
        this.object.scale.y = 1.5;
        this.object.scale.z = 1.5;

        this.object.position.set(57,20, -35);
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);
    }
}