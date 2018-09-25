/**
 * MyLamp
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyLamp extends CGFobject {
	/**
	 * Builds a MyLamp object, resembling a semi-sphere.
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 * @param {Number} minS minimum s texture coordinates
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, slices, stacks, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.maxS = maxS;
		this.minS = minS;
		this.minT = minT;
		this.maxT = maxT;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, normals, indices and texture coordinates
	 */
	initBuffers() {
		var alpha = 2 * Math.PI / this.slices;
		var beta = (Math.PI / 2) / this.stacks;
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var raio = 1;

		for (var i = 0; i < this.stacks; i++) {
			if (i > 0)
				raio = Math.cos(Math.asin(z));

			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);
				this.texCoords.push(0.5 + (Math.cos(j * alpha) * raio) / 2.0, 0.5 - (Math.sin(j * alpha) * raio) / 2.0);
			}

			z += 1 / this.stacks;
		}

		this.vertices.push(0, 0, 1);
		this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);
		this.texCoords.push(0.5, 0.5);

		var ind = 0;

		for (let i = 0; i < this.stacks - 1; i++) {
			for (let j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + 1, ind + this.slices + 1);
					this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
				}
				ind++;
			}
		}

		var vert_ind = ind + this.slices + 1;
		var first_ind = ind;

		for (let i = 0; i <= this.slices; i++) {
			if (i == this.slices) {
				this.indices.push(ind, first_ind, vert_ind);
			} else {
				this.indices.push(ind, ind + 1, vert_ind);
			}
			ind++;
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};