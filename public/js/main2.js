
//this is the main code that calls up our scene manager
 
const canvas = document.getElementById("canvas");

const sceneManager = new SceneManager(canvas);


bindEventListeners()
render();

function bindEventListeners() {
	document.addEventListener('keyup', (event) => onKeyUp(event), false);

	window.onresize = resizeCanvas;
	resizeCanvas();	
}


function onKeyUp(event) {

	switch (event.keyCode) {

		case 27: //escape key
				//check if game is paused
				if (sceneManager.game_state == sceneManager.GAME_PAUSE) {
					sceneManager.unpause();
				}
				else {
					sceneManager.pause();
				}
			break;
	}
}


function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height= '100%';
	
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
    
    sceneManager.onWindowResize();
}

function render() { 
    requestAnimationFrame(render);
    sceneManager.update();
}

