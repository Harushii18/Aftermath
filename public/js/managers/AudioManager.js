import * as THREE from '../../../jsm/three.module.js';
export class AudioManager{
    constructor(){
        this.entities = {};
        this.audioListener = new THREE.AudioListener();
    }
    
    //typing the function outside will make it public as well (just like using this)
    register(key,soundPath) {//'assets/footstep.mpeg'

      //  this.camera.add( audioListener );

        // create a global audio source
        var sound = new THREE.Audio( this.audioListener );

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load( soundPath, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        //sound.play();
        });

        this.entities[key] = sound;
        console.log(this.entities[key]);

    }
    
    update(time) {

    }
    
    clear() {
        this.entities = {};
    }


}