class LinearAnimation extends Animation {
  constructor(scene, time, controlPoints) {
    super(scene, time);
    this.controlPoints = controlPoints;
    this.currentControlPoint = 1;
    this.vel = this.getVel();
    this.setVelComponents();
    this.x = controlPoints[0].x;
    this.y = controlPoints[0].y;
    this.z = controlPoints[0].z;
    this.ang = this.updateAng();
  }

  setControlPoints(controlPoints) {
    this.controlPoints = controlPoints;
  }

  setVelComponents() {
    var currPoint = this.controlPoints[this.currentControlPoint];
    var previousPoint = this.controlPoints[this.currentControlPoint - 1];
    var dist = this.dists[this.currentControlPoint - 1];
    this.velX = this.vel * ((currPoint.x - previousPoint.x) / dist);
    this.velY = this.vel * ((currPoint.y - previousPoint.y) / dist);
    this.velZ = this.vel * ((currPoint.z - previousPoint.z) / dist);
  }

  getControlPoints() {
    return this.controlPoints;
  }

  getVel() {
    var dist = 0;
    this.dists = [];
    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      this.dists.push(Math.sqrt(
        Math.pow((this.controlPoints[i + 1].x - this.controlPoints[i].x), 2) +
        Math.pow((this.controlPoints[i + 1].y - this.controlPoints[i].y), 2) +
        Math.pow((this.controlPoints[i + 1].z - this.controlPoints[i].z), 2)))
      dist += this.dists[i];
    }

    var vel = dist / (this.time * 1000.0);

    this.intervalTimes = [];

    for (let i = 0; i < this.dists.length; i++)
      this.intervalTimes.push(this.dists[i] / vel);

    return vel;
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

    var time_after = deltaTime;
    this.timeElapsed += deltaTime;
    if (this.timeElapsed >= this.intervalTimes[this.currentControlPoint - 1]) {

      time_after = this.timeElapsed - this.intervalTimes[this.currentControlPoint - 1];
      this.timeElapsed = time_after;

      if (this.currentControlPoint == this.controlPoints.length - 1) {
        this.over = true;
        this.resetAnimation();
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

  incVars(currPoint, time) {

    if (currPoint.x != this.x)
      this.x += this.velX * time;
    if (currPoint.y != this.y)
      this.y += this.velY * time;
    if (currPoint.z != this.z)
      this.z += -this.velZ * time;
  }

  apply() {
    // this.scene.pushMatrix();
    this.scene.translate(this.x, this.y, this.z);
    // this.scene.rotate(this.ang, 0, 1, 0);
    // this.scene.popMatrix();
  }
}