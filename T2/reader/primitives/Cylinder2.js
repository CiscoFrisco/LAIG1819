class Cylinder2 extends CGFobject {
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

	display() {
		this.obj.display();
	}

	initControlPoints() {

		this.controlPoints = [
			[
				[0.0, -this.base, 0.0, 1.0],
				[-this.base, -this.base, 0.0, Math.sqrt(2)/2.0],
				[-this.base, 0.0, 0.0, 1.0],
				[-this.base, this.base, 0.0,  Math.sqrt(2)/2.0],
				[0, this.base, 0.0, 1.0],
				[this.base, this.base, 0.0,  Math.sqrt(2)/2.0],
				[this.base, 0.0, 0.0, 1.0],
				[this.base, -this.base, 0.0,  Math.sqrt(2)/2.0],
				[0.0,-this.base, 0.0, 1.0]
			],
			[
				[0.0, -this.top, this.height, 1.0],
				[-this.top, -this.top, this.height, Math.sqrt(2)/2.0],
				[-this.top, 0.0, this.height, 1.0],
				[-this.top, this.top, this.height,  Math.sqrt(2)/2.0],
				[0, this.top, this.height, 1.0],
				[this.top, this.top, this.height,  Math.sqrt(2)/2.0],
				[this.top, 0.0, this.height, 1.0],
				[this.top, -this.top, this.height,  Math.sqrt(2)/2.0],
				[0.0,-this.top, this.height, 1.0]
			]
		];

		//this.controlPoints = allControlPoints;
		console.log(this.controlPoints);
	}



}