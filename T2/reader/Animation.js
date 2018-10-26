class Animation {
  constructor() {
    if (this.constructor == Animation) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  update(currTime) {
    this.lastTime = this.lastTime || 0;
    this.deltaTime = currTime - this.lastTime;
    this.lastTime = currTime;
  }

  apply() {}
}