class CircularAnimation extends Animation {

    constructor(time, center, radius, initAngle, rotAngle){
        super();

        this.time = time;
        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
    }

    setTime(time){
        this.time = time;
    }

    setCenter(center){
        this.center = center;
    }
    
    setRadius(radius){
        this.radius = radius;
    }
    
    setInitAngle(initAngle){
        this.initAngle = initAngle;
    }

    setRotAngle(rotAngle){
        this.rotAngle = rotAngle;
    }

    getTime(){
        return this.time;
    }

    getCenter(){
        return this.center;
    }

    getRadius(){
        return this.radius;
    }

    getInitAngle(){
        return this.initAngle;
    }

    getRotAngle(){
        return this.rotAngle;
    }

    update(currTime){
        super(currTime);
    }

    apply(){
        
    }
}