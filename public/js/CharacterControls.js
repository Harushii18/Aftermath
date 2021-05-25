class CharacterControls {

    //this class checks for character movement events
    constructor() {
        this.movements = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };

        document.addEventListener('keyup', (event) => this.KeyUp(event), false);
        document.addEventListener('keydown', (event) => this.KeyDown(event), false);

    }

    KeyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this.movements.forward = true;
                console.log('w');
                break;
            case 65: // a
                this.movements.left = true;
                console.log('a');
                break;
            case 83: // s
                this.movements.backward = true;
                console.log('s');
                break;
            case 68: // d
                this.movements.right = true;
                console.log('d');
                break;

        }
    }
    //this stops the character movement
    KeyUp(event) {
        switch (event.keyCode) {
            case 87: // w
                this.movements.forward = false;
                break;
            case 65: // a
                this.movements.left = false;
                break;
            case 83: // s
                this.movements.backward = false;
                break;
            case 68: // d
                this.movements.right = false;
                break;
        }
    }

    checkMovement() {
        if (this.movements.backward && this.movements.forward && this.movements.left && this.movements.right) {
            return true
        }
        return false
    }

    getMovements(){
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

var characterControls=new CharacterControls();