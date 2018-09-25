/**
 * MyWheelBumper
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyWheelBumper extends CGFobject {
	/**
	 * Builds a MyWheelBumper object.
	 * 
	 * @param {CGFscene} scene 
	 * @param {Number} slices 
	 * @param {Number} stacks 
	 */
	constructor(scene, slices, stacks) {
		super(scene);

		this.bumper = new MyBumper(scene, slices);
		this.cylinder = new MyCylinder(scene, slices, stacks, false, true);
		this.quad = new MyQuad(scene);

		this.bumper.initBuffers();
		this.cylinder.initBuffers();
		this.quad.initBuffers();
	};

	/**
	 * Displays this object.
	 */
	display() {
		this.scene.pushMatrix();
		this.bumper.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0, -1);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.bumper.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0, -1);
		this.cylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 1, -0.5);
		this.scene.scale(2, 1, 1);
		this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.quad.display();
		this.scene.popMatrix();
	};
};