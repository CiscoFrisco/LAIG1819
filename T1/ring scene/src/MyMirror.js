/**
 * MyMirror
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyMirror extends CGFobject {
	/**
	 * Builds a MyMirror object, destined to be used in MyVehicle
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 * @param {Boolean} inverse 
	 */
	constructor(scene, slices, stacks, inverse = false) {
		super(scene);

		this.inverse = inverse;

		this.frame = new MyLamp(scene, slices, stacks);
		this.circle = new MyPoligon(scene, slices);
		this.cylinder = new MyCylinder(scene, slices, stacks);

		this.factor = inverse ? 1 : -1;

		this.frame.initBuffers();
		this.circle.initBuffers();
	};

	/**
	 * Displays this object
	 */
	display() {
		this.scene.pushMatrix();

		this.scene.rotate(this.factor * Math.PI / 9, 0, 1, 0);

		this.scene.rotate(this.factor * Math.PI / 6, 1, 0, 0);

		this.scene.scale(0.5, 0.7, 1);
		this.scene.rotate(Math.PI / 2, 0, 1, 0);
		this.frame.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();

		this.scene.rotate(this.factor * Math.PI / 9, 0, 1, 0);

		if (!this.inverse)
			this.scene.rotate(Math.PI / 9, 1, 0, 0);
		else
			this.scene.rotate(Math.PI - Math.PI / 9, 1, 0, 0);

		this.scene.translate(0.1, 0, 0.9);
		this.scene.scale(0.1, 0.1, 1);
		this.cylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();

		this.scene.translate(0.7, -0.65, this.factor * 1.8);

		this.scene.scale(0.2, 0.2, 0.2);

		if (!this.inverse)
			this.scene.rotate(Math.PI, 0, 1, 0);

		this.frame.display();
		this.scene.popMatrix();

		this.scene.materialDefault.apply();

		this.scene.pushMatrix();


		this.scene.rotate(this.factor * Math.PI / 9, 0, 1, 0);
		this.scene.rotate(this.factor * Math.PI / 6, 1, 0, 0);


		this.scene.scale(0.5, 0.7, 1);
		this.scene.rotate(-Math.PI / 2, 0, 1, 0);
		this.circle.display();
		this.scene.popMatrix();
	};
};