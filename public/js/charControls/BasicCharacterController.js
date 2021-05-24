class BasicCharacterController{
    constructor(){
        this.input=new BasicCharacterControllerInput();
        this.stateMachine=new FiniteStateMachine(new BasicCharacterControllerProxy(this));

       
    }

}