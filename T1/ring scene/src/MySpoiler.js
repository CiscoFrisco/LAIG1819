/**
 * MySpoiler
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySpoiler extends CGFobject {
	/**
	 * Builds a MySpoiler object
	 * 
	 * @param {CGFscene} scene 
	 */
	constructor(scene) {
		super(scene);

		this.trapeze = new My3DTrapeze(scene, 1, 0.5, 1, 1, 0.7);
		this.rectangle = new MyUnitCubeQuad(scene);

		this.trapeze.initBuffers();
	};

	/**
	 * Displays this object
	 */
	display() {
		this.scene.pushMatrix();
		this.scene.translate(0.3, 0, 2);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(1, 1, 0.2);
		this.trapeze.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0.3, 0, -2);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(1, 1, 0.2);
		this.trapeze.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI / 4, 0, 0, 1);
		this.scene.scale(1, 0.1, 4);
		this.rectangle.display();
		this.scene.popMatrix();
	};
};