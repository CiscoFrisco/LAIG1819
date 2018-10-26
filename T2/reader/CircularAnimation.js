class CircularAnimation extends Animation {

    constructor(scene, time, center, radius, initAngle, rotAngle){
        super(scene, time);

        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
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
        super.update(currTime);
    }

    apply(){
        
    }
}