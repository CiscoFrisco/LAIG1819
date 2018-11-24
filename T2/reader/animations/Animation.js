/**
 * Animation class, representing an animation to be used by a vehicle.
 */
class Animation {
  /**
   * Creates an animation. It has to be either linear or circular since this class is abstract.
   * @param {CGFScene} scene main scene 
   * @param {float} time animation time span(duration)
   */
  constructor(scene, time) {
    if (this.constructor == Animation) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
    this.scene = scene;
    this.time = time;
    this.over = false;
    this.timeElapsed = 0;
  }
  /**
   * Updates animation parameters with new values.
   * @param {float} deltaTime time passed since last update
   */
  update(deltaTime) {
  }

  /**
   * Applies the animation to the scene using the updated parameters of the respective class 
   * (LinearAnimation or CircularAnimation).
   */
  apply() { }
}