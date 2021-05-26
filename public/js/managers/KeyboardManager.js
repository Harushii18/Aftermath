//this class checks for keyboard events
export class KeyboardManager {

    constructor() {

        //this will store whether the key was pressed or not
        //false= not pressed, true=pressed
        this.keys = {
            W: false,
            A: false,
            S: false,
            D: false,
            SHIFT: false,
            ESC: false
        };

        //add listeners
        document.addEventListener('keyup', (event) => this.KeyUp(event), false);
        document.addEventListener('keydown', (event) => this.KeyDown(event), false);
    }

    //key was pressed
    KeyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this.keys.W = true;
                break;
            case 65: // a
                this.keys.A = true;
                break;
            case 83: // s
                this.keys.S = true;
                break;
            case 68: // d
                this.keys.D = true;
                break;
            case 16: // shift
                this.keys.SHIFT = true;
                break;


        }
    }

    //key was released
    KeyUp(event) {
        switch (event.keyCode) {
            case 87: // w
                this.keys.W = false;
                break;
            case 65: // a
                this.keys.A = false;
                break;
            case 83: // s
                this.keys.S = false;
                break;
            case 68: // d
                this.keys.D = false;
                break;
            case 16: // shift
                this.keys.SHIFT = false;
                break;


        }
    }

    //gets string key value user is checking was pressed
    wasPressed(key) {
        switch (key) {
            case 'W': // w
                return (this.keys.W);
            case 'A': // a
                return (this.keys.A);
            case 'S': // s
                return (this.keys.S);
            case 'D': // d
                return (this.keys.D);
            case 'SHIFT': // shift
                return (this.keys.SHIFT);
        }
        return;
    }

    getKeys() {
        return this.keys;
    }
}

//global variable exported to allow access to the movements
export var keyboardManager = new KeyboardManager();