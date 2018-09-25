/**
 * MyCylinderRound
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinderRound extends CGFobject {
	/**
	 * Builds a MyCylinderRound object, used to make a wheel. 
	 * 
	 * @param {CGFScene} scene CGFscene
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, slices, stacks, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, normals, indices and texture coordinates.
	 */
	initBuffers() {
		var alpha = 2 * Math.PI / this.slices;
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var incS = (this.maxS - this.minS) / this.slices;
		var incT = (this.maxT - this.minT) / this.stacks;

		var raio = 1;
		var zi = 0;

		for (let i = 0; i <= this.stacks; i++) {
			if (i > (this.stacks - 10)) {
				for (let j = 0; j < this.slices; j++) {
					zi += 1 / this.stacks;
					raio = Math.cos(Math.asin(z - 0.5));
					this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, z);
					this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);

					this.texCoords.push(this.maxS - incS * j, this.minT + incT * i);
				}
			} else {
				for (let j = 0; j < this.slices; j++) {
					this.vertices.push(Math.cos(j * alpha), Math.sin(j * alpha), z);
					this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), 0);
					this.texCoords.push(this.maxS - incS * j, this.minT + incT * i);
				}
			}

			z += 1 / this.stacks;
		}

		var ind = 0;

		for (let i = 0; i < this.stacks; i++) {
			for (let j = 0; j < this.slices; j++) {
				if (j != this.slices - 1) {
					this.indices.push(ind, ind + 1, ind + this.slices);
					this.indices.push(ind + this.slices, ind + 1, ind + this.slices + 1);
				} else {
					this.indices.push(ind, i * this.slices, ind + this.slices);
					this.indices.push(ind + this.slices, i * this.slices, (i + 1) * this.slices);
				}

				ind++;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};