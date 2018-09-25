/**
 * MyTrapeze
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTrapeze extends CGFobject {
	/**
	 * Builds a MyTrapeze object
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} bigBase 
	 * @param {Number} smallBase 
	 * @param {Number} height 
	 * @param {Number} offset 
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, bigBase = 1, smallBase = 0.5, height = 1, offset = 0, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;
		this.bigBase = bigBase;
		this.smallBase = smallBase;
		this.height = height;
		this.offset = offset;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, texture coordinates and normals
	 */
	initBuffers() {
		this.vertices = [-(this.bigBase) / 2.0, -(this.height) / 2.0, 0,
			(this.bigBase) / 2.0, -(this.height) / 2.0, 0, -(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, 0,
			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, 0,
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1,
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.normals = [0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];

		this.initGLBuffers();
	};
};