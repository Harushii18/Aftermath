
//this is the main code that calls up our scene manager

import { SceneManager } from './managers/SceneManager.js';

//global variables
const canvas = document.getElementById("canvas");
const sceneManager = new SceneManager(canvas);


bindEventListeners()
render();

function bindEventListeners() {
	document.addEventListener('keyup', (event) => onKeyUp(event), false);

	window.onresize = resizeCanvas;
	resizeCanvas();
}

//========================================================================
//KAMERON-> MOVE THIS TO ANOTHER MANAGER
/*
I did my keyboard stuff in the char controls class, but you'll probably need to make another class and put the event listener there.
I'm not sure how to make a keyboard manager, since char controls and pausing are different events, so that's why I didn't
make one. Because I don't doing everything in one thing is ok... But actually.... Wait
*/
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
//=========================================================================


function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height = '100%';

	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	sceneManager.onWindowResize();
}

function render() {
	requestAnimationFrame(render);
	sceneManager.update();
}

