/**
 * MyBumper
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyBumper extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene
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

		//texture limits
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
		var alpha = Math.PI / this.slices;

		//initialize arrays
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		//variable useful for texture mapping
		var incS = (this.maxS - this.minS) / this.slices;

		//push bumper vertices
		for (var j = 0; j <= this.slices; j++) {

			this.vertices.push(Math.cos(j * alpha), Math.sin(j * alpha), 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(0.5 + (Math.cos(j * alpha) / 2), 1);

			this.vertices.push(Math.cos(j * alpha), 1, 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(0.5 + (Math.cos(j * alpha) / 2), 0);
		}

		var ind = 0;

		//push indices to create bumper
		for (let j = 0; j <= this.slices * 2 - 1; j++) {
			if (ind % 2 == 0)
				this.indices.push(ind, ind + 1, ind + 2);
			else
				this.indices.push(ind, ind + 2, ind + 1);

			ind++;
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};