class LinearAnimation extends Animation {
    constructor(scene, time, controlPoints) {
        super(scene, time);
        this.controlPoints = controlPoints;
        this.vel = this.getVel();
        this.currentControlPoint = 1;
        this.x = controlPoints[0].x;
        this.y = controlPoints[0].y;
        this.z = controlPoints[0].z;
        this.ang = this.updateAng();

        this.intervalTime = this.time / (controlPoints.length - 1);
    }

    setControlPoints(controlPoints) {
        this.controlPoints = controlPoints;
    }

    getControlPoints() {
        return this.controlPoints;
    }

    getVel() {
        var dist = 0;
        for (let i = 0; i < this.controlPoints.length - 1; i++) {

            dist += Math.sqrt(Math.pow((this.controlPoints[i + 1].x - this.controlPoints[i].x), 2) +
                Math.pow((this.controlPoints[i + 1].y - this.controlPoints[i].y), 2) +
                Math.pow((this.controlPoints[i + 1].z - this.controlPoints[i].z), 2));
        }

        return dist / (this.time * 1000.0);
    }

    updateAng() {
        var currPoint = this.controlPoints[this.currentControlPoint];
        this.ang = Math.atan2(currPoint.z - this.z, currPoint.x - this.x);
    }

    resetAnimation() {
        this.currentControlPoint = 1;
        this.x = this.controlPoints[0].x;
        this.y = this.controlPoints[0].y;
        this.z = this.controlPoints[0].z;
        this.ang = this.updateAng();
    }

    update(deltaTime) {
        var currPoint = this.controlPoints[this.currentControlPoint];

        if (this.timeElapsed > this.intervalTime * 1000)
        //if (Math.abs(currPoint.x - this.x) < 0.5 && Math.abs(currPoint.y - this.y)<= 0.5  && Math.abs(currPoint.z - this.z) <= 0.5) 
        {
            this.timeElapsed = 0;

            if (this.currentControlPoint == this.controlPoints.length - 1) {
                this.over = true;
                this.resetAnimation();
            } else {
                this.x = currPoint.x;
                this.y = currPoint.y;
                this.z = currPoint.z;
                this.currentControlPoint++;
                this.updateAng();
            }
        } else {
            var timeLeft = deltaTime;
            if(this.timeElapsed + deltaTime > this.interval * 1000){
                timeLeft = this.timeElapsed + deltaTime - this.interval * 1000;
            }

            if (currPoint.x > this.x)
                this.x += this.vel * timeLeft;
            else if (currPoint.x < this.x)
                this.x += -this.vel * timeLeft;

            if (currPoint.y > this.y)
                this.y += this.vel * timeLeft;
            else if (currPoint.y < this.y)
                this.y += -this.vel * timeLeft;

            if (currPoint.z > this.z)
                this.z += this.vel * timeLeft;
            else if (currPoint.z < this.z)
                this.z += -this.vel * timeLeft;
        }

        this.timeElapsed += deltaTime;
    }

    apply() {
        //this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        //this.scene.rotate(this.ang, 0, 1, 0);
        //this.scene.popMatrix();
    }
}