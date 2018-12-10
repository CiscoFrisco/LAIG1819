class LinearAnimation extends Animation {
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

  setControlPoints(controlPoints) {
    this.controlPoints = controlPoints;
  }

  setVelComponents() {
    var currPoint = this.controlPoints[this.currentControlPoint];
    var previousPoint = this.controlPoints[this.currentControlPoint - 1];
    var dist = this.dists[this.currentControlPoint - 1];
    this.velX = this.vel * ((currPoint[0] - previousPoint[0]) / dist);
    this.velY = this.vel * ((currPoint[1] - previousPoint[1]) / dist);
    this.velZ = this.vel * ((currPoint[2] - previousPoint[2]) / dist);
  }

  getControlPoints() {
    return this.controlPoints;
  }

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

  updateAng() {
    var currPoint = this.controlPoints[this.currentControlPoint];

    if(currPoint[0] - this.x == 0)
      this.ang = 0;
    else
      this.ang = Math.atan((currPoint[0] - this.x)/(currPoint[2] - this.z));

    if(currPoint[2] < this.z)
      this.ang += Math.PI;
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
      }
      else {
        this.currentControlPoint++;
        this.updateAng();
        this.setVelComponents();
      }
    }
    else if (!this.over){
      this.incVars(currPoint, time_after);
    }
  }

  incVars(currPoint, time) {

    if (currPoint[0] != this.x)
      this.x += this.velX * time;
    if (currPoint[1] != this.y)
      this.y += this.velY * time;
    if (currPoint[2] != this.z)
      this.z += this.velZ * time;
  }

  apply() {
    this.scene.translate(this.x, this.y, this.z);
    //this.scene.rotate(this.ang, 0, 1, 0);
  }

  isOver(){
    return this.over;
  }
}