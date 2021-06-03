//makes use of determining what button was pressed from the keyboard manager
import { keyboardManager } from './KeyboardManager.js';

//this class checks for movement events of the main Character
export class CharacterControls {

    constructor() {
        //walking and running speeds
        this.walk = 0.08; //Was 0.5 - can change back
        this.run = 0.15; //Was 1 - can change back
        this.state = 'idle';

        //set the char to normal walk speed initially
        this.moveDistance = this.walk;
    }

    checkMovement() {
        //checks if character is moving/ not moving for determining what animation to play
        if (keyboardManager.wasPressed('W') || keyboardManager.wasPressed('A') || keyboardManager.wasPressed('S') || keyboardManager.wasPressed('D')) {
            return true
        }
        return false
    }

    getSpeed() {
        //controls speed of character if he is running/ not running
        if (this.getRun() == true) {
            this.moveDistance = this.run;
        } else {
            this.moveDistance = this.walk;
        }
        return this.moveDistance;
    }
    
    getRun() {
        //checks if the character is running
        return keyboardManager.wasPressed('SHIFT');
    }

    getMovingState(){
        //this returns the direction the character is moving in
        if (this.moveForward()){
            if (this.moveRight()){
                //forward right
                return "forwardRight"

            }else if (this.moveLeft()){
                //forward left
                return "forwardLeft"
            }else{
                //just forward
                return "forward"
            }
        }

        if (this.moveBackward()){
            if (this.moveRight()){
                //backward right
                return "backRight"

            }else if (this.moveLeft()){
                //backward left
                return "backLeft"

            }else{
                //just backward
                return "back"
            }

        }
        if (this.moveLeft()){
            return "left"
        }
        if (this.moveRight()){
            return "right"
        }
    }


    getMovements() {
        return keyboardManager.getKeys();
    }


    moveForward() {
         //checks if the character is walking forward
        return keyboardManager.wasPressed('W');
    }
    moveBackward() {
         //checks if the character is walking backwards
        return keyboardManager.wasPressed('S');
    }
    moveLeft() {
         //checks if the character is walking sideways to the left
        return keyboardManager.wasPressed('A');
    }
    moveRight() {
         //checks if the character is walking sideways to the right
        return keyboardManager.wasPressed('D');
    }
    rotateRight(){
      return keyboardManager.wasPressed('X');
    }
    rotateLeft(){
      return keyboardManager.wasPressed('Z');
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
