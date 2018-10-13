/**
 * MyQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyQuad extends CGFobject {
	
	/**
	 * Builds a MyQuad object
	 * @param {CGFscene} scene main scene
	 * @param {Number} x1 x1 coordinate on xOy plane
	 * @param {Number} y1 y1 coordinate on xOy plane
	 * @param {Number} x2 x2 coordinate on xOy plane
	 * @param {Number} y2 y2 coordinate on xOy plane
	 */
	constructor(scene, x1, y1, x2, y2) {
		super(scene);

		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates
	 */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0, this.x1, this.y2, 0,
			this.x2, this.y2, 0,
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1,
		];

		this.texCoords = [
			0.0, 1.0,
			1.0, 1.0,
			0.0, 0.0,
			1.0, 0.0,
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.normals = [0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];

		this.initGLBuffers();
	};

	/**
	 * Used to update texture coordinates upon drawing.
	 * @param {Number} length_s scale factor (length)
	 * @param {Number} length_t scale factor (width)
	 */
	updateTexCoords(length_s, length_t) {

		var maxT = (this.y2 - this.y1) / length_t;
		var maxS = (this.x2 - this.x1) / length_s;

		this.texCoords = [
			0.0, maxT,
			maxS, maxT,
			0.0, 0.0,
			maxS, 0.0,
		]

		this.updateTexCoordsGLBuffers();
	}
};