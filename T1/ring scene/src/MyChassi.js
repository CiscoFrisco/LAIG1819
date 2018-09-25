/**
 * MyChassi
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyChassi extends CGFobject {
	/**
	 * Builds a MyChassi object, destined to be used in MyVehicle
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {*} minS minimum s texture coordinate
	 * @param {*} maxS maximum s texture coordinate
	 * @param {*} minT minimum t texture coordinate
	 * @param {*} maxT maximum t texture coordinate
	 */
	constructor(scene, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.width = 4.4;

		//chassi elements
		this.trapeze = new My3DTrapeze(scene, 1, 0.7, this.width, 1, 0.15);
		this.trapeze2 = new My3DTrapeze(scene, 1, 0.7, this.width, 1, 0.05);
		this.cube = new MyUnitCubeQuad(scene);
		this.bumper = new MyWheelBumper(scene, 20, 1);
	};

	/**
	 * Displays this object
	 */
	display() {
		var size = -6.5;

		this.scene.pushMatrix();
		this.scene.translate(size + 5.65, 0.75, 0);
		this.scene.scale(9.7, 0.5, this.width);
		this.cube.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size + 0.3, 0.75, 0);
		this.scene.scale(1, 0.5, 1);
		this.trapeze.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, 0, 0);
		this.trapeze.display();
		size += 1.5;
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, -0.5, this.width / 2);
		this.scene.scale(1, 1, this.width);
		this.bumper.display();
		size += 3.5;
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, -0.6, 0);
		this.scene.scale(5, 0.2, 1);
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.trapeze2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, 0, 0);
		this.scene.scale(5, 1, this.width);
		this.scene.rotate(Math.PI, 0, 0, 1);
		this.scene.rotate(Math.PI, 1, 0, 0);
		this.cube.display();
		size += 3.5;
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, -0.5, this.width / 2);
		this.scene.scale(1, 1, this.width);
		this.bumper.display();
		size += 1.5;
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, 0, 0);
		this.scene.scale(1, 1, this.width);
		this.cube.display();
		size += 1;
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(-3, 1.5, 0);
		this.scene.scale(5, 1, 1);
		this.trapeze2.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(size, 0.25, 0);
		this.scene.scale(1, 1.5, 1);
		this.scene.rotate(-Math.PI / 2, 0, 0, 1);
		this.trapeze.display();
		this.scene.popMatrix();
	}
};