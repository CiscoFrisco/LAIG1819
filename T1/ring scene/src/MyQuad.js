/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyQuad extends CGFobject {
	/**
	 * Builds a MyQuad object
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates
	 */
	initBuffers() {
		this.vertices = [-0.5, -0.5, 0,
			0.5, -0.5, 0, -0.5, 0.5, 0,
			0.5, 0.5, 0,
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1,
		];

		this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,
			this.maxS, this.minT,
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