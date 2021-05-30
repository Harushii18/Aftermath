class GameOverlay{
    constructor() {
        //load a model and animate it
        //TODO!

        //creating a box (need to change it to a character with animations)
        this.overlay = document.getElementsByClassName("gameIconBottom");





        this.update = function (time) {
            //Do nothing

        };
    }
    showOverlay() {
        console.log('Imma show');
        for (let i = 0; i < this.overlay.length; i++) {
            this.overlay[i].style.display = 'inline-block';
        }
    }

    changeText(newText){
        document.getElementsByClassName("gameIconBottomOverlayText").innerHTML = newText ;
    }


    hideOverlay() {
        for (let i = 0; i < this.overlay.length; i++) {
            this.overlay[i].style.display = 'none';
        }
    }
}

export var gameOverlay=new GameOverlay();