class Time {
    constructor(){
        this.total_run_time = 0;
        this.clock = new THREE.Clock();
    }


    getDelta(){
        return this.clock.getDelta();
    }

    getElapsed()
    {
        return this.clock.getElapsedTime();
    }



    


}