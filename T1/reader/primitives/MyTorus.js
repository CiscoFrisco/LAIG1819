/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTorus extends CGFobject {
	/**
	 * Builds a MyCylinder object
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 * @param {Boolean} outside 
	 * @param {Boolean} half 
	 */
	constructor(scene, inner, outer, slices, sides) {
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
		var radius = (this.outer - this.inner) / 2;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var incS = 1.0 / this.slices;
		var incT = 1.0 / this.sides;

		for (let i = 0; i <= this.sides; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * radius, Math.cos(z) * this.inner + Math.sin(j * alpha) * Math.cos(z) * radius, Math.sin(z) * this.inner + Math.sin(j * alpha) * Math.sin(z) * radius);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha) * Math.cos(z), Math.sin(j * alpha) * Math.sin(z));
				this.texCoords.push(1.0 - incS * j, 0.0 + incT * i);
			}

			z += beta;
		}

		var ind = 0;

		for (let i = 0; i < this.sides; i++) {
			for (let j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + 1, ind + this.slices + 1);
					this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
				}
				ind++;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(length_s, length_t) {

	}
};