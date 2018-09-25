/**
 * MyBreather
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyBreather extends CGFobject {
	/**
	 * Builds a MyBreather object, destined to be used in MyVehicle
	 * 
	 * @param {CGFscene} scene CGFscene
	 */
	constructor(scene) {
		super(scene);

		//breather elements
		this.trapeze = new My3DTrapeze(scene, 1, 0.5, 1, 1, 0.2);
		this.rectangle = new MyQuad(scene);

		//breather texture
		this.breatherColor = new CGFappearance(this.scene);
		this.breatherColor.setAmbient(10 / 255, 20 / 255, 30 / 255, 1.0);
		this.breatherColor.setDiffuse(10 / 255, 20 / 255, 30 / 255, 1.0);

		//init element buffers
		this.trapeze.initBuffers();
		this.rectangle.initBuffers();
	};

	/**
	 * Displays this object
	 */
	display() {

		//display breather frame
		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI / 2, 0, 1, 0);
		this.trapeze.display();
		this.scene.popMatrix();

		this.breatherColor.apply();
		//display breather face
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 0.5);
		this.rectangle.display();
		this.scene.popMatrix();
	};
};