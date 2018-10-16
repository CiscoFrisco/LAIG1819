/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTorus extends CGFobject {

	/**
	 * Builds a MyTorus object
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} slices number of slices
	 * @param {Number} sides number of sides
	 * @param {Number} inner 
	 * @param {Number} outer 
	 */
	constructor(scene, slices, sides, inner, outer) {
		super(scene);

		this.slices = slices;
		this.sides = sides;
		this.inner = inner;
		this.outer = outer;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
	initBuffers() {
		var alpha = 2 * Math.PI / this.slices;
		var beta = 2 * Math.PI / this.sides;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var incS = 1.0 / this.slices;
		var incT = 1.0 / this.sides;

		for (let i = 0; i <= this.sides; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.sin(z) * this.outer + Math.sin(j * alpha) * Math.sin(z) * this.inner, Math.cos(z) * this.outer + Math.sin(j * alpha) * Math.cos(z) * this.inner, Math.cos(j * alpha) * this.inner);
				this.normals.push(Math.sin(j * alpha) * Math.sin(z), Math.sin(j * alpha) * Math.cos(z), Math.cos(j * alpha));
				this.texCoords.push(incS * i, 1.0 - incT * j);
			}

			z += beta;
		}

		var ind = 0;

		for (let i = 0; i < this.sides; i++) {
			for (let j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + this.slices + 1, ind + 1);
					this.indices.push(ind + this.slices + 1, ind + this.slices + 2, ind + 1);
				}
				ind++;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	 * Used to update texture coordinates upon drawing. Not required for this object.
	 * @param {Number} length_s scale factor (length)
	 * @param {Number} length_t scale factor (width)
	 */
	updateTexCoords(length_s, length_t) {

	}
};