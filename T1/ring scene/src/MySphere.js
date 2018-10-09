/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

// TODO: radius

class MySphere extends CGFobject {
	/**
	 * Builds a MyLamp object, resembling a semi-sphere.
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 */
	constructor(scene, radius, slices, stacks) {
		super(scene);

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, normals, indices and texture coordinates
	 */
	initBuffers() {
		var alpha = 2 * Math.PI / this.slices;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var raio = 1;

		for (var i = 0; i < this.stacks / 2; i++) {
			if (i > 0)
				raio = Math.cos(Math.asin(z));

			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);
				this.texCoords.push(0.5 + (Math.cos(j * alpha) * raio) / 2.0, 0.5 - (Math.sin(j * alpha) * raio) / 2.0);
			}

			z += 1 / (this.stacks / 2);
		}

		this.vertices.push(0, 0, 1);
		this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);
		this.texCoords.push(1, 1);

		var z = 0;
		var raio = 1;

		for (var i = 0; i < this.stacks / 2; i++) {
			if (i > 0)
				raio = Math.cos(Math.asin(z));

			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, -z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), -raio);
				this.texCoords.push(0.5 + (Math.cos(j * alpha) * raio) / 2.0, 0.5 - (Math.sin(j * alpha) * raio) / 2.0);
			}

			z += 1 / (this.stacks / 2);
		}

		this.vertices.push(0, 0, -1);
		this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), -raio);
		this.texCoords.push(0.0, 0.0);

		var ind = 0;

		for (var i = 0; i < this.stacks / 2 - 1; i++) {
			for (var j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + 1, ind + this.slices + 1);
					this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
				}
				ind++;
			}
		}

		var vert_ind = ind + this.slices + 1;
		var first_ind = ind;

		for (var i = 0; i <= this.slices; i++) {
			if (i == this.slices) {
				this.indices.push(ind, first_ind, vert_ind);
			} else {
				this.indices.push(ind, ind + 1, vert_ind);
			}
			ind++;
		}

		ind++;

		for (var i = 0; i < this.stacks / 2 - 1; i++) {
			for (var j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + this.slices + 1, ind + 1);
					this.indices.push(ind + this.slices + 1, ind + this.slices + 2, ind + 1);
				}
				ind++;
			}
		}

		vert_ind = ind + this.slices + 1;
		first_ind = ind;

		for (var i = 0; i <= this.slices; i++) {
			if (i == this.slices) {
				this.indices.push(ind, vert_ind, first_ind);
			} else {
				this.indices.push(ind, vert_ind, ind + 1);
			}
			ind++;
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(length_s, length_t) {

		this.updateTexCoordsGLBuffers();
	}
};