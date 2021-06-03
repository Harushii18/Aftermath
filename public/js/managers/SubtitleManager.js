import * as THREE from '../../jsm/three.module.js';

class SubtitleManager extends THREE.Object3D {
    constructor() {
        super();
        this.subtitles = document.getElementById('subtitle');

        this.update = function (time) {

            //Do nothing

        };

        this.time;
        this.subtitleDuration;
    }

    startTime(){
        //start the time for the subtitle duration
        this.time=0;

    }

    countTime(){
         //increase the time for the subtitle duration
        this.time=this.time+1;
    }

    checkTime(){
        if (this.time==this.subtitleDuration){
            //hide the subtitles after it has displayed for a certain amount of time
            this.hideSubtitles();
            return false;
        }
        return true;
    }

    setDuration(duration){
        //set how long the subtitle displays for
        this.subtitleDuration=duration;
    }

    changeSubtitlesText(newText){
        this.subtitles.innerHTML = newText;
    }

    showSubtitles(){
            this.subtitles.style.display = 'block';
    }

    hideSubtitles(){
            this.subtitles.style.display = 'none';
    }

 
}

export var subtitleManager = new SubtitleManager();
