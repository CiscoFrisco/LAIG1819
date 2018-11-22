class CircularAnimation extends Animation {

    constructor(scene, time, center, radius, initAngle, rotAngle) {
        super(scene, time);

        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
        this.vel = this.rotAngle / (this.time * 1000);
        this.rotInc = this.InitAngle;
    }

    setCenter(center) {
        this.center = center;
    }

    setRadius(radius) {
        this.radius = radius;
    }

    setInitAngle(initAngle) {
        this.initAngle = initAngle;
    }

    setRotAngle(rotAngle) {
        this.rotAngle = rotAngle;
    }

    getCenter() {
        return this.center;
    }

    getRadius() {
        return this.radius;
    }

    getInitAngle() {
        return this.initAngle;
    }

    update(deltaTime) {

        if (this.timeElapsed >= this.time * 1000) {
            this.over = true;
        }
        else 
            this.rotInc =  this.initAngle + (this.vel * this.timeElapsed);

        this.timeElapsed += deltaTime;
    }

    apply() {

        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.rotate(this.rotInc,0,1,0);
        this.scene.translate(this.radius, 0, 0);
        if(this.vel > 0)
            this.scene.rotate(Math.PI,0,1,0);
           
    }
}