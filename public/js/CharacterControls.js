class CharacterControls {

    //this class checks for character movement events
    constructor() {

        //move character either forward/ backward/ left/ right
        this.movements = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };

        this.run = false;
        document.addEventListener('keyup', (event) => this.KeyUp(event), false);
        document.addEventListener('keydown', (event) => this.KeyDown(event), false);

    }

    KeyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this.movements.forward = true;
                break;
            case 65: // a
                this.movements.left = true;
                break;
            case 83: // s
                this.movements.backward = true;
                break;
            case 68: // d
                this.movements.right = true;
                break;
            case 16: // shift
                this.run = true;
                break;


        }
    }
    //this stops the character movement
    KeyUp(event) {
        switch (event.keyCode) {
            case 87: // w
                this.movements.forward = false;
                console.log('w');
                break;
            case 65: // a
                this.movements.left = false;
                console.log('a');
                break;
            case 83: // s
                this.movements.backward = false;
                console.log('s');
                break;
            case 68: // d
                this.movements.right = false;
                console.log('d');
                break;
            case 16: // shift
                this.run = false;
                break;
        }
    }

    checkMovement() {
        if (this.movements.backward && this.movements.forward && this.movements.left && this.movements.right) {
            return true
        }
        return false
    }

    getRun(){
        return this.run;
    }

    getMovements() {
        return this.movements;
    }

    moveForward() {
        return this.movements.forward
    }
    moveBackward() {
        return this.movements.backward
    }
    moveLeft() {
        return this.movements.left
    }
    moveRight() {
        return this.movements.right
    }
}

var characterControls = new CharacterControls();