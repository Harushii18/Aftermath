import * as THREE from '../../jsm/three.module.js';

class SubtitleManager extends THREE.Object3D {
    constructor() {
        super();
        this.subtitles = document.getElementById('subtitle');
        this.clock=new THREE.Clock();

        this.update = function (time) {

            //Do nothing

        };

        this.time;
        this.show;
        this.subtitleDuration;
    }

    startTime(){
        //start the time for the subtitle duration
        this.time=0;
        this.show=true;

    }

    countTime(){
        var delta=this.clock.getDelta();
         //increase the time for the subtitle duration-> makes sure it runs on seconds and not frame rates
        this.time+=(1*delta);
    }

    checkTime(){
        if (this.time>this.subtitleDuration && this.show==true){
            //hide the subtitles after it has displayed for a certain amount of time
            this.hideSubtitles();
            this.show=false;
            return false;
        }
        else{
          return true;
        }

    }

    setDuration(duration){
        //set how long the subtitle displays for
        this.subtitleDuration=duration;
    }

    changeSubtitlesText(newText){
        this.subtitles.innerHTML = newText;
    }

    showSubtitles(){
            //console.log("Showing Subtitles");
            this.subtitles.style.display = 'block';
    }

    hideSubtitles(){
            //console.log("Hiding Subtitles");
            this.subtitles.style.display = 'none';
    }


}

export var subtitleManager = new SubtitleManager();
