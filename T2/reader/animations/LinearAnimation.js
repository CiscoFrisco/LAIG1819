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
  }

  setControlPoints(controlPoints) {
    this.controlPoints = controlPoints;
  }

  getControlPoints() {
    return this.controlPoints;
  }

  getVel() {
    var dist = 0;
    var dists = [];
    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      dists.push(Math.sqrt(
        Math.pow((this.controlPoints[i + 1].x - this.controlPoints[i].x), 2) +
        Math.pow((this.controlPoints[i + 1].y - this.controlPoints[i].y), 2) +
        Math.pow((this.controlPoints[i + 1].z - this.controlPoints[i].z), 2)))
      dist += dists[i];
    }
    var vel = dist / (this.time * 1000.0);

    this.intervalTimes = [];

    for (let i = 0; i < dists.length; i++)
      this.intervalTimes.push(dists[i] / vel);

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

    var time_before = deltaTime,
      time_after = 0;

    if (this.timeElapsed + deltaTime >=
      this.intervalTimes[this.currentControlPoint - 1]) {
      time_before =
        this.intervalTimes[this.currentControlPoint - 1] - this.timeElapsed;

      time_after = this.timeElapsed + deltaTime - this.intervalTimes[this.currentControlPoint - 1];
      this.timeElapsed = time_after;

      if (this.currentControlPoint == this.controlPoints.length - 1) {
        this.over = true;
        this.resetAnimation();
      } else {
        this.currentControlPoint++;
        this.updateAng();
      }
    } else
      this.timeElapsed += deltaTime;

    this.incVars(currPoint, time_before);
    currPoint = this.controlPoints[this.currentControlPoint];
    if(!this.over)
    this.incVars(currPoint, time_after);
  }

  incVars(currPoint, time) {
    if (currPoint.x > this.x)
      this.x += this.vel * time;
    else if (currPoint.x < this.x)
      this.x += -this.vel * time;

    if (currPoint.y > this.y)
      this.y += this.vel * time;
    else if (currPoint.y < this.y)
      this.y += -this.vel * time;

    if (currPoint.z > this.z)
      this.z += this.vel * time;
    else if (currPoint.z < this.z)
      this.z += -this.vel * time;
  }

  apply() {
    // this.scene.pushMatrix();
    this.scene.translate(this.x, this.y, this.z);
    // this.scene.rotate(this.ang, 0, 1, 0);
    // this.scene.popMatrix();
  }
}