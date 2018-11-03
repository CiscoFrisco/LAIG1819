class CircularAnimation extends Animation {

    constructor(scene, time, center, radius, initAngle, rotAngle){
        super(scene, time);

        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
        this.x = Math.sin(this.initAngle);
        this.z = Math.cos(this.initAngle); 
        this.vel = this.getVel();
        this.rotInc = 0;
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

    getVel() {
        var dist = this.radius * this.rotAngle;
        return dist / (this.time * 1000);
    }

    updateAng() {
        this.ang = this.rotInc + Math.PI/2;
    }

    resetAnimation() {
        this.rotInc = 0;
        this.x = Math.sin(this.initAngle)*this.radius;
        this.z = Math.cos(this.initAngle)*this.radius;
    }

    update(deltaTime) {

       if(this.timeElapsed >= this.time * 1000)
        {   
                this.over = true;
                this.resetAnimation();
        }
        else
        {
            var timeLeft = deltaTime;

            if(this.timeElapsed + deltaTime > this.time * 1000)
                timeLeft = this.time * 1000 - this.timeElapsed;

            this.rotInc += this.vel * timeLeft;
            this.updateAng();
            this.x = Math.sin(this.initAngle + this.rotInc)*this.radius;
            this.z = Math.cos(this.initAngle + this.rotInc)*this.radius; 
        }

        this.timeElapsed += deltaTime;
    }

    apply() {
        //this.scene.pushMatrix();
        this.scene.translate(this.x, 0, this.z);
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        //this.scene.rotate(this.ang, 0, 1, 0);
        //this.scene.popMatrix();
    }
}