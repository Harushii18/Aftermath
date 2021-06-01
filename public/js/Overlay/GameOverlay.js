import * as THREE from '../../jsm/three.module.js';

class GameOverlay extends THREE.Object3D {
    constructor() {
        super();
        this.overlay = document.getElementById('gameBottom')
        this.subtitles = document.getElementById('subtitle');

        this.update = function (time) {


            //Do nothing

        };
    }


    //INTERACTION OVERLAY============================================
    showOverlay() {
            this.overlay.style.display = 'inline-block';
    }

    changeText(newText) {
        this.overlay.innerHTML = newText;
    }

    hideOverlay() {
            this.overlay.style.display = 'none';
    }
    //======================================================================
    //SUBTITLES OVERLAY=================================================

    changeSubtitlesText(newText){
        this.subtitles.innerHTML = newText;
    }

    showSubtitles(){
            this.subtitles.style.display = 'block';
    }

    hideSubtitles(){
            this.subtitles.style.display = 'none';
    }

   //=====================================================================
}

export var gameOverlay = new GameOverlay();
