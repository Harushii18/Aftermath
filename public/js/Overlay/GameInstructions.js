import * as THREE from '../../jsm/three.module.js';

class GameInstructions extends THREE.Object3D {
    constructor() {
        super();
        this.instructions = document.getElementById('gameInstructions')
        this.clock=new THREE.Clock();
        this.count=0;

        //THE BELOW ARE ALL IN SECONDS:
        this.startValue=25; //what second the first instruction stops displaying at
        this.hideDuration=2; //how long to hide the instruction
        this.showDuration=5;//how long to show the instruction
        this.start=true;

        this.update = function (time) {
           
        };
    }

    //INTERACTION OVERLAY============================================
    showInstructions(text) {
            this.instructions.style.display = 'inline-block';
            this.instructions.innerHTML = text;
    }

    hideInstructions() {
            this.instructions.style.display = 'none';
    }

    checkTime(){
        if (this.start){
            var delta=this.clock.getDelta();
            this.count+=(1*delta);
            if (this.count<this.startValue){
                this.showInstructions('CLICK THE LEFT MOUSE BUTTON TO LOOK AROUND');            }
            else if (this.count<this.startValue+this.hideDuration){
                this.hideInstructions();
            }
            else if (this.count<this.startValue+this.hideDuration+this.showDuration){
                this.showInstructions('USE THE W,A,S,D KEYS TO MOVE');
            }
            else if (this.count<this.startValue+(this.hideDuration*2)+this.showDuration){
                this.hideInstructions();
            }
            else if (this.count<this.startValue+(this.hideDuration*2)+(this.showDuration*2)){
                this.showInstructions('PRESS SHIFT TO WALK FASTER');
            }
            else if (this.count<this.startValue+(this.hideDuration*3)+(this.showDuration*2)){
                this.hideInstructions();
            }
            else if (this.count<this.startValue+(this.hideDuration*3)+(this.showDuration*3)){
                this.showInstructions('PRESS P TO PAUSE THE GAME');
            }
            else if (this.count<this.startValue+(this.hideDuration*4)+(this.showDuration*3)){
                this.hideInstructions();
            } else if (this.count<this.startValue+(this.hideDuration*4)+(this.showDuration*4)){
                this.showInstructions('PRESS V TO CHANGE VIEWS');
            }
            else if (this.count<this.startValue+(this.hideDuration*5)+(this.showDuration*4)){
                this.hideInstructions();
                this.start=false;
            }
        }
       
    }
}

export var gameInstructions=new GameInstructions();