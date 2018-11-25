/**
 * Cylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Cylinder2 extends CGFobject {
	/**
	 * Build a Cylinder2 object using NURBS
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} base radius for base
	 * @param {Number} top radius for top
	 * @param {Number} height distance between covers
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 */
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.nPointsU = 2;
		this.nPointsV = 9;

		this.initControlPoints();

		var nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);
		this.obj = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);
	};

	/**
	 * Display this object.
	 */
	display() {
		this.obj.display();
	}

	/**
	 * Initialize control points.
	 */
	initControlPoints() {

		this.controlPoints = [
			[
				[0.0, -this.base, 0.0, 1.0],
				[-this.base, -this.base, 0.0, Math.sqrt(2) / 2.0],
				[-this.base, 0.0, 0.0, 1.0],
				[-this.base, this.base, 0.0, Math.sqrt(2) / 2.0],
				[0, this.base, 0.0, 1.0],
				[this.base, this.base, 0.0, Math.sqrt(2) / 2.0],
				[this.base, 0.0, 0.0, 1.0],
				[this.base, -this.base, 0.0, Math.sqrt(2) / 2.0],
				[0.0, -this.base, 0.0, 1.0]
			],
			[
				[0.0, -this.top, this.height, 1.0],
				[-this.top, -this.top, this.height, Math.sqrt(2) / 2.0],
				[-this.top, 0.0, this.height, 1.0],
				[-this.top, this.top, this.height, Math.sqrt(2) / 2.0],
				[0, this.top, this.height, 1.0],
				[this.top, this.top, this.height, Math.sqrt(2) / 2.0],
				[this.top, 0.0, this.height, 1.0],
				[this.top, -this.top, this.height, Math.sqrt(2) / 2.0],
				[0.0, -this.top, this.height, 1.0]
			]
		];
	}
}