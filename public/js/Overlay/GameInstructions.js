import * as THREE from '../../jsm/three.module.js';

class GameInstructions extends THREE.Object3D {
    constructor() {
        super();
        this.instructions = document.getElementById('gameInstructions')

        this.count=0;
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
        if (this.count<731){
            this.count+=1;
            if (this.count==180){
                this.showInstructions('CLICK THE LEFT MOUSE BUTTON TO LOOK AROUND');            }
            if (this.count==360){
                this.hideInstructions();
            }
            if (this.count==365){
                this.showInstructions('USE THE W,A,S,D KEYS TO MOVE');
            }
            if (this.count==545){
                this.hideInstructions();
            }
            if (this.count==550){
                this.showInstructions('PRESS P TO PAUSE THE GAME');
            }
            if (this.count==730){
                this.hideInstructions();
            }
        }
       
    }
}

export var gameInstructions=new GameInstructions();