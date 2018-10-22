class LinearAnimation extends Animation{
    constructor(time, controlPoints){
        super();
        this.time = time;
        this.controlPoints = controlPoints;
    }

    setTime(time){
        this.time = time;
    }

    setControlPoints(controlPoints){
        this.controlPoints = controlPoints;
    }

    getTime(){
        return this.time;
    }

    getControlPoints(){
        return this.controlPoints;
    }
}