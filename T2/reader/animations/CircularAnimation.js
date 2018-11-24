/**
 * Circular Animation class. Extends the Animation class.
 */
class CircularAnimation extends Animation {

    /**
     * Creates a circular animation with the given parameters.
     * @param {*} scene main scene
     * @param {*} time animation time span(duration)
     * @param {*} center center of the circular movement
     * @param {*} radius radius of the movement
     * @param {*} initAngle initial angle of animation (determines initial position of the object to be animated)
     * @param {*} rotAngle  rotation angle (how much the object will rotate)
     */
    constructor(scene, time, center, radius, initAngle, rotAngle) {
        super(scene, time);

        this.center = center;
        this.radius = radius;
        this.initAngle = initAngle;
        this.rotAngle = rotAngle;
        this.vel = this.rotAngle / (this.time * 1000);
        this.rotInc = this.InitAngle;
    }

    /**
     * Updates the rotation angle if the animation is not over.
     * Increments the time passed by since the animation started.
     * @param {*} deltaTime time passed since last update
     */
    update(deltaTime) {

        if (this.timeElapsed >= this.time * 1000) {
            this.over = true;
        }
        else 
            this.rotInc =  this.initAngle + (this.vel * this.timeElapsed);

        this.timeElapsed += deltaTime;
    }

    /**
    * Uses the updated animation parameters to simulate the animation.
    */
    apply() {

        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.rotate(this.rotInc,0,1,0);
        this.scene.translate(this.radius, 0, 0);
        if(this.vel > 0)
            this.scene.rotate(Math.PI,0,1,0);
           
    }
}