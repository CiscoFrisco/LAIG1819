/**
 * MyHalfWheel
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyHalfWheel extends CGFobject {
	/**
	 * Builds a MyHalfWheel object
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

		this.mainCylinder = new MyCylinderRound(scene, slices, stacks);
		this.innerCylinder = new MyCylinder(scene, slices, stacks, false);
		this.bump = new MyLamp(scene, slices, stacks, true);
		this.rim = new MyTrapeze(scene, 0.5, 0.5, 2, 1);
		this.num_bumps = num_bumps;
		this.size_of_bump = 3 / this.num_bumps;
		this.length_of_bump = (2 / stacks);
		this.angle = 0;
		this.inc = 2 * Math.PI / this.num_bumps;
		this.stacks = stacks;


		this.tireTexture = new CGFappearance(this.scene);
		this.tireTexture.loadTexture("../resources/images/tire.png");

		this.rimTexture = new CGFappearance(this.scene);
		this.rimTexture.setAmbient(250 / 255, 255 / 255, 210 / 255, 1.0);
		this.rimTexture.setDiffuse(250 / 255, 255 / 255, 210 / 255, 1.0);

		this.mainCylinder.initBuffers();
		this.innerCylinder.initBuffers();
		this.bump.initBuffers();
		this.rim.initBuffers();
	};

	/**
	 * Displays this object
	 */
	display() {
		this.scene.pushMatrix();
		this.scene.materialDefault.apply();
		this.mainCylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(0.89, 0.89, 0.95);
		this.innerCylinder.display();
		this.scene.popMatrix();

		var z = 0;
		var initAngle = 0;

		for (let i = 0; i < 1 / this.size_of_bump; i++) {
			this.angle = initAngle;

			for (let j = 0; j < this.num_bumps; j++) {
				this.scene.pushMatrix();
				this.tireTexture.apply();
				if (i > (1 / this.size_of_bump) / 2)
					this.scene.translate(Math.cos(this.angle) * 0.9, Math.sin(this.angle) * 0.9, z + this.size_of_bump);
				else
					this.scene.translate(Math.cos(this.angle), Math.sin(this.angle), z + this.size_of_bump);

				this.scene.rotate(this.angle, 0, 0, 1);
				this.scene.rotate(Math.PI / 2, 0, 1, 0);
				this.scene.scale(this.size_of_bump, this.size_of_bump, this.size_of_bump);
				this.bump.display();
				this.scene.popMatrix();

				this.angle += this.inc;
			}

			z += this.size_of_bump;
			initAngle += this.inc / 2;
		}

		this.angle = 0;

		this.rimTexture.apply();

		for (; this.angle < 2 * Math.PI; this.angle += this.inc * 2) {
			this.scene.pushMatrix();
			this.scene.translate(0, 0, 1);
			this.scene.rotate(this.angle, 0, 0, 1);
			this.scene.scale(0.2, 0.9, 1);
			this.rim.display();
			this.scene.popMatrix();
		}

		this.scene.materialDefault.apply();
	};
};