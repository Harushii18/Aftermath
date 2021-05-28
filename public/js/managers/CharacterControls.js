//makes use of determining what button was pressed from the keyboard manager
import { keyboardManager } from './KeyboardManager.js';

//this class checks for movement events
export class CharacterControls {

    constructor() {
        //walking and running speeds 
        this.walk = 0.3;
        this.run = 0.5;
        this.state = 'idle';

        //set the char to normalla walk speed initially
        this.moveDistance = this.walk;
    }

    checkMovement() {
        if (keyboardManager.wasPressed('W') || keyboardManager.wasPressed('A') || keyboardManager.wasPressed('S') || keyboardManager.wasPressed('D')) {
            return true
        }
        return false
    }

    getSpeed() {
        //controls speed if character if he is running/ not running
        if (this.getRun() == true) {
            this.moveDistance = this.run;
        } else {
            this.moveDistance = this.walk;
        }
        return this.moveDistance;
    }
    getRun() {
        return keyboardManager.wasPressed('SHIFT');
    }

    getMovements() {
        return keyboardManager.getKeys();
    }


    moveForward() {
        return keyboardManager.wasPressed('W');
    }
    moveBackward() {
        return keyboardManager.wasPressed('S');
    }
    moveLeft() {
        return keyboardManager.wasPressed('A');
    }
    moveRight() {
        return keyboardManager.wasPressed('D');
    }

    //ANIMATIONS=====================================================
    checkAnimState(state) {
        //checks if the curr animation is already playing
        return (this.state == state);
    }

    setAnimState(state) {
        //changes curr animation state
        this.state = state;
    }

}

//global variable exported to allow access to the movements
export var characterControls = new CharacterControls();