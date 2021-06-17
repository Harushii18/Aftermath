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

            
            I: false,
            K: false,
            J: false,
            L: false,
            
            SHIFT: false,
            P: false,

            E: false,

            //For rotating
            Z: false,
            X: false,

            //For switching camera views
            V: false

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

            case 73: 
                this.keys.I = true;
                break;

            case 74: 
                this.keys.J = true;
                break;

            case 75: 
                this.keys.K = true;
                break;

            case 76: 
                this.keys.L = true;
                break;

            case 38: 
                this.keys.UP = true;
                break;

            case 40: 
                this.keys.DOWN = true;
                break;

            case 37: 
                this.keys.LEFT = true;
                break;

            case 39: 
                this.keys.RIGHT = true;
                break;
            
            case 16: // shift
                this.keys.SHIFT = true;
                break;
            case 69: //e
            if (event.repeat == false)
            {
                this.keys.E = true;
            }
                break;

            //For rotations
            case 90:
              this.keys.Z = true;
              break;
            case 88:
              this.keys.X = true;
              break;


            //For switching camera views
              case 86:
              if (event.repeat == false)
              {
                this.keys.V = true;
                this.keyDownQueue.push("V");
              }
                break;



		    case 27: //escape key

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


                case 73: 
                this.keys.I = false;
                break;

            case 74: 
                this.keys.J = false;
                break;

            case 75: 
                this.keys.K = false;
                break;

            case 76: 
                this.keys.L = false;
                break;

            case 38: 
                this.keys.UP = false;
                break;

            case 40: 
                this.keys.DOWN = false;
                break;

            case 37: 
                this.keys.LEFT = false;
                break;

            case 39: 
                this.keys.RIGHT = false;
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


              //For switching camera views
                case 86:
                  this.keys.V = false;
                  break;



            case 27: //escape key

            case 80: //"p" key
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

            case 'I': // w
                return (this.keys.I);
            case 'J': // a
                return (this.keys.J);
            case 'K': // s
                return (this.keys.K);
            case 'L': // d
                return (this.keys.L);

            case 'UP': // w
                return (this.keys.UP);
            case 'DOWN': // a
                return (this.keys.DOWN);
            case 'LEFT': // s
                return (this.keys.LEFT);
            case 'RIGHT': // d
                return (this.keys.RIGHT);

            case 'SHIFT': // shift
                return (this.keys.SHIFT);
            case 'E'://e
                return (this.keys.E);


            case 'Z'://Z
                return (this.keys.Z);

            case 'X'://X
                return (this.keys.X);



            case 'V':
                return (this.keys.V);

            case 'ESC'://X
            return (this.keys.ESC);


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
