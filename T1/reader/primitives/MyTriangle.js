/**
 * MyTriangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTriangle extends CGFobject {

	/**
	 * Builds a MyTriangle object
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} x1 x1 coordinate
	 * @param {Number} y1 y1 coordinate
	 * @param {Number} z1 z1 coordinate
	 * @param {Number} x2 x2 coordinate
	 * @param {Number} y2 y2 coordinate
	 * @param {Number} z2 z2 coordinate
	 * @param {Number} x3 x3 coordinate
	 * @param {Number} y3 y3 coordinate
	 * @param {Number} z3 z3 coordinate
	 */
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.v1 = vec3.fromValues(x1, y1, z1);
		this.v2 = vec3.fromValues(x2, y2, z2);
		this.v3 = vec3.fromValues(x3, y3, z3);

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates
	 */
	initBuffers() {
		this.vertices = [
			this.v1[0], this.v1[1], this.v1[2],
			this.v2[0], this.v2[1], this.v2[2],
			this.v3[0], this.v3[1], this.v3[2],
		];

		this.indices = [
			0, 1, 2,
		];

		var v21 = vec3.fromValues(this.v2[0] - this.v1[0], this.v2[1] - this.v1[1], this.v2[2] - this.v1[2]);
		var v32 = vec3.fromValues(this.v3[0] - this.v2[0], this.v3[1] - this.v2[1], this.v3[2] - this.v3[2]); //vetor do ponto 2 ao ponto 3
		var n = vec3.create()
		vec3.cross(n, v21, v32);
		vec3.normalize(n, n);

		this.normals = [
			n[0], n[1], n[2],
			n[0], n[1], n[2],
			n[0], n[1], n[2],
		];

		this.texCoords = [
			0, 0, //this.minS, this.minT,
			0, 1, //this.minS, this.maxT,
			1, 1, //this.maxS, this.maxT,
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	 * Used to update texture coordinates upon drawing.
	 * @param {Number} length_s scale factor (length)
	 * @param {Number} length_t scale factor (width)
	 */
	updateTexCoords(length_s, length_t) {
		var a = Math.sqrt(Math.pow(this.v1[0] - this.v3[0], 2) + Math.pow(this.v1[1] - this.v3[1], 2) + Math.pow(this.v1[2] - this.v3[2], 2));
		var b = Math.sqrt(Math.pow(this.v2[0] - this.v1[0], 2) + Math.pow(this.v2[1] - this.v1[1], 2) + Math.pow(this.v2[2] - this.v1[2], 2));
		var c = Math.sqrt(Math.pow(this.v3[0] - this.v2[0], 2) + Math.pow(this.v3[1] - this.v2[1], 2) + Math.pow(this.v3[2] - this.v2[2], 2));

		var beta = Math.acos((Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c));

		// TODO: v???

		var v = a * Math.sin(beta);

		this.texCoords = [
			(c - a * Math.cos(beta)) / length_s, (v - a * Math.sin(beta)) / length_t,
			0, v / length_t,
			c / length_s, v / length_t,
		];

		this.updateTexCoordsGLBuffers();
	}
};