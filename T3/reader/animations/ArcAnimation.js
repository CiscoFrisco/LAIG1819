class ArcAnimation extends Animation {

    constructor(scene, time, initPoint, endPoint) {
        super(scene, time);

        this.center = [(endPoint[0] + initPoint[0])/2, 0, (endPoint[2] + initPoint[2])/2];
        this.radius = Math.sqrt(Math.pow((endPoint[0]-initPoint[0]), 2) + Math.pow(endPoint[2]-initPoint[2], 2))/2;
        this.vel = Math.PI / (this.time * 1000);
        this.rotInc = 0;
    }

    update(deltaTime) {

        if (this.timeElapsed >= this.time * 1000) {
            this.over = true;
        }
        else 
            this.rotInc = this.vel * this.timeElapsed;

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