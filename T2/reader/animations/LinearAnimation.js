/**
 * Linear Animation class. Extends the Animation class.
 */
class LinearAnimation extends Animation {
  /**
   * Creates a linear animation with the given parameters.
   * @param {CGFscene} scene  main scene
   * @param {float} time animation time span(duration)
   * @param {Array} controlPoints array with the scene coordinates the animation will have to go through sequentially.
   */
  constructor(scene, time, controlPoints) {
    super(scene, time);
    this.controlPoints = controlPoints;
    this.currentControlPoint = 1;
    this.vel = this.getVel();
    this.setVelComponents();
    this.x = controlPoints[0][0];
    this.y = controlPoints[0][1];
    this.z = controlPoints[0][2];
    this.updateAng();
  }

  /**
   * Using the current velocity and the distances between the components(x,y,z) of two sequential points, it calculates 
   * each component's velocity for the animation.
   */
  setVelComponents() {
    var currPoint = this.controlPoints[this.currentControlPoint];
    var previousPoint = this.controlPoints[this.currentControlPoint - 1];
    var dist = this.dists[this.currentControlPoint - 1];
    this.velX = this.vel * ((currPoint[0] - previousPoint[0]) / dist);
    this.velY = this.vel * ((currPoint[1] - previousPoint[1]) / dist);
    this.velZ = this.vel * ((currPoint[2] - previousPoint[2]) / dist);
  }

  /**
   * Calculates the average velocity of the whole animation 
   * (Sum of all the distances divided by the time span of the animation in milliseconds). 
   * It also calculates the time it takes to travel between every two control points.
   */
  getVel() {
    var dist = 0;
    this.dists = [];
    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      this.dists.push(Math.sqrt(
        Math.pow((this.controlPoints[i + 1][0] - this.controlPoints[i][0]), 2) +
        Math.pow((this.controlPoints[i + 1][1] - this.controlPoints[i][1]), 2) +
        Math.pow((this.controlPoints[i + 1][2] - this.controlPoints[i][2]), 2)))
      dist += this.dists[i];
    }

    var vel = dist / (this.time * 1000.0);

    this.intervalTimes = [];

    for (let i = 0; i < this.dists.length; i++)
      this.intervalTimes.push(this.dists[i] / vel);

    return vel;
  }

  /**
   * Updates the angle of the animation so that the vehicle to be 
   * animated always faces the direction of the next control point.
   */
  updateAng() {
    var currPoint = this.controlPoints[this.currentControlPoint];

    if(currPoint[0] - this.x == 0)
      this.ang = 0;
    else
      this.ang = Math.atan((currPoint[0] - this.x)/(currPoint[2] - this.z));

    if(currPoint[2] < this.z)
      this.ang += Math.PI;
  }

  /**
   * Verifies if the vehicle reached the control point it is heading to. 
   * If so it updates the control point to be next one after that one in the array of control points.
   * Else it continues to update the vehicle's coordinates.
   * If it reaches the last control point it ends the animation.
   * @param {float} deltaTime  time passed by since last update.
   */
  update(deltaTime) {

    var currPoint = this.controlPoints[this.currentControlPoint];

    var time_after = deltaTime;
    this.timeElapsed += deltaTime;
    if (this.timeElapsed >= this.intervalTimes[this.currentControlPoint - 1]) {

      time_after = this.timeElapsed - this.intervalTimes[this.currentControlPoint - 1];
      this.timeElapsed = time_after;

      if (this.currentControlPoint == this.controlPoints.length - 1) {
        this.over = true;
      }
      else {
        this.currentControlPoint++;
        this.updateAng();
        this.setVelComponents();
      }
    }
    else {
      this.incVars(currPoint, time_after);
    }
  }

  /**
   * Checks if the curent vehicle's coordinates are different from the control point's coordinates.
   * If so, updates them.
   * @param {Array} currPoint control point which the vehicle is heading to.
   * @param {float} time time passed since last update.
   */
  incVars(currPoint, time) {

    if (currPoint[0] != this.x)
      this.x += this.velX * time;
    if (currPoint[1] != this.y)
      this.y += this.velY * time;
    if (currPoint[2] != this.z)
      this.z += this.velZ * time;
  }

  /**
   * Uses the updated animation parameters to simulate the animation.
   */
  apply() {
    
    this.scene.translate(this.x, this.y, this.z);
    this.scene.rotate(this.ang, 0, 1, 0);
  }
}