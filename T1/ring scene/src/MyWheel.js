/**
 * MyWheel
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyWheel extends CGFobject {
	/**
	 * Builds a MyWheel object, composed of 'two' MyHalfWheels.
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 * @param {Number} num_bumps 
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, slices, stacks, num_bumps, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.halfWheel = new MyHalfWheel(scene, slices, stacks, num_bumps);
		this.rot = Math.PI / num_bumps;

		this.halfWheel.initBuffers();
	};

	/**
	 * Displays this object.
	 */
	display() {
		this.scene.pushMatrix();
		this.scene.scale(1, 1, 0.5);
		this.halfWheel.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.scene.rotate(this.rot, 0, 0, 1);
		this.scene.scale(1, 1, 0.5);
		this.halfWheel.display();
		this.scene.popMatrix();
	};
};