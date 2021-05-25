
class PauseMenu extends Overlay{
	constructor(width,height) {

    super(width,height);
    //this.overlay = new Overlay(width,height);
    var bitmap = this.canvas.getContext('2d');//this.canvas.getCanvasContext();
    bitmap.font = "Normal 40px Arial";
    bitmap.textAlign = 'center';
    bitmap.fillStyle = "rgba(100,100,100,0.5)";
    bitmap.fillText('Game is Paused', width/2  , height /2);

		this.refreshPlane();


    

	}

	update(time) {
	}
}