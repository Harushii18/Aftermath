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
            P: false,

            E: false,

            //For rotating
            Z: false,
            X: false

        };

        this.keyDownQueue = [];//Stores multiple key presses in sequence
        this.event =  {
            repeat: false}

        //move camera on mouse movements
        // this.mouseX = 0;
        // this.mouseY = 0;
        // this.windowHalfX = window.innerWidth / 2;
        // this.windowHalfY = window.innerHeight / 2;
        // document.addEventListener('mousemove', this.onDocumentMouseMove);


        //add listeners
        document.addEventListener('keyup', (event) => this.KeyUp(event), false);
        document.addEventListener('keydown', (event) => this.KeyDown(event), false);
    }

    // onDocumentMouseMove(event) {
    //     this.mouseX = (event.clientX - this.windowHalfX) / 100;
    //     this.mouseY = (event.clientY - this.windowHalfY) / 100;

    // }

    getMouseX() {
        return this.mouseX;
    }
    getMouseY() {
        return this.mouseY;
    }

    getEvent()
    {
        return this.event;
    }
    //key was pressed
    KeyDown(event) {
        this.event = event;
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
            case 69: //e
                this.keys.E = true;
                break;

            //For rotations
            case 90:
              this.keys.Z = true;
              break;
            case 88:
              this.keys.X = true;
              break;

            
		    case 80: //"p" key
                if (event.repeat == false)
                {
                    this.keys.P = true;
                    this.keyDownQueue.push("P");
                   /* if (sceneManager.game_state == sceneManager.GAME_PAUSE) {
                        sceneManager.unpause();
                    }
                    else if (sceneManager.game_state == sceneManager.GAME_RUN)
                    {
                        sceneManager.pause();
                    }   */
                }
                break;


        }
    }

    //key was released
    KeyUp(event) {

        this.event = event;
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
            case 69: //e
                this.keys.E = false;
                break;

                //For rotations
            case 90:
              this.keys.Z = false;
              break;
            case 88:
              this.keys.X = false;
              break;
            case 80: //"p" key
              //check if game is paused
             // console.log(event.repeat);
              //if (event.repeat == false)
              //{
                  this.keys.P = false;
                 /* if (sceneManager.game_state == sceneManager.GAME_PAUSE) {
                      sceneManager.unpause();
                  }
                  else if (sceneManager.game_state == sceneManager.GAME_RUN)
                  {
                      sceneManager.pause();
                  }   */
              //}
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
            case 'E'://e
                return (this.keys.E);


            case 'Z'://Z
                return (this.keys.Z);

            case 'X'://X
                return (this.keys.X);
            
            case 'P'://P
            return (this.keys.P);

        return;
    }
  }

    getKeys() {
        return this.keys;
    }
}

//global variable exported to allow access to the movements
export var keyboardManager = new KeyboardManager();
