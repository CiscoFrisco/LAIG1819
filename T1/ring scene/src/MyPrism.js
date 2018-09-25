/**
 * MyPrism
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPrism extends CGFobject {
	/**
	 * Builds a MyPrism object
	 * 
	 * @param {CGFScene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 */
	constructor(scene, slices, stacks) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, normals and indices.
	 */
	initBuffers() {
		var alpha = 2 * Math.PI / this.slices;
		var beta = alpha / 2;
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		var ind = 0;
		var a, b, z;

		for (var i = 0; i < this.slices; i++) {
			z = 0;

			for (var j = 0; j <= this.stacks; j++) {
				this.vertices.push(Math.cos(i * alpha), Math.sin(i * alpha), z);
				this.normals.push(Math.cos((i * alpha) + beta), Math.sin((i * alpha) + beta), 0);
				this.vertices.push(Math.cos((i * alpha) + alpha), Math.sin((i * alpha) + alpha), z);
				this.normals.push(Math.cos((i * alpha) + beta), Math.sin((i * alpha) + beta), 0);
				z += 1 / this.stacks;
			}

			a = 1;
			b = 2;

			for (var c = 0; c < this.stacks; c++) {
				this.indices.push(ind, ind + a, ind + b);
				this.indices.push(ind + b, ind + a, ind + 3);
				ind += 2;
			}
			ind += 2;
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};