import * as THREE from '../../../jsm/three.module.js';
import { GLTFLoader } from '../../../jsm/GLTFLoader.js';
import { keyboardManager } from '../../managers/KeyboardManager.js';

import { loadingManager, mainChar, hudOverlayRemoveQueue } from '../../managers/SceneManager.js';
import { gameOverlay } from '../../Overlay/GameOverlay.js';
import { subtitleManager } from '../../managers/SubtitleManager.js';


export class Plank extends THREE.Object3D {


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




        var gltf = loader.load('woodplank.glb', (gltf) => {
            //console.log("loaded drawer");
            gltf.scene.traverse(c => {
                c.castShadow = true;

            });



            var obj_gltf = new THREE.Object3D();

            obj_gltf.scale.x = 6.5;
            obj_gltf.scale.y = 8;
            obj_gltf.scale.z = 8;


            // obj_gltf.position.set(0,6, 0);


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
        // //Contains the text for each subtitle
        // this.subtitleText = {
        //     t1: "The drawer is locked. I need to find a way to open it",
        //     t2: "There's a key!"
        // };
    }

    setAllowInteraction(value) {
        this.allowInteraction = value;
    }

    //set position plank 

    setPosition(x, y, z) {
        this.object.position.set(x, y, z);
    }

    //set position of wooden plank 

    setRotation(angle) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), angle);
    }



    update(time) {


    }
}