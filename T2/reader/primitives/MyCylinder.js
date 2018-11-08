/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject {

	/**
	 * Builds a MyCylinder object, with covers on both sides.
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} base radius for base
	 * @param {Number} top radius for top
	 * @param {Number} height distance between covers
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 */
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);

		this.base = base;
		this.top = top;
		this.heigh = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
	initBuffers() {
		var z_inc = this.heigh / this.stacks;
		var alpha = 2 * Math.PI / this.slices;
		var raio = this.base;
		var r_inc = (this.top - this.base) / this.stacks;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;

		var incS = 1.0 / this.slices;
		var incT = 1.0 / this.stacks;


		for (var j = 0; j <= this.slices; j++) {
			this.vertices.push(0,0,z);
			this.normals.push(0,0,-1);
			this.texCoords.push( 0 + incS * j, 0.0);
		}
		
		for (let i = 0; i <= this.stacks; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), z);
				this.texCoords.push(1.0 - incS * j, 0.0 + incT * i);
			}

			z += z_inc;
			raio += r_inc;
		}

		for (var j = 0; j <= this.slices; j++) {
			this.vertices.push(0,0,z - z_inc);
			this.normals.push(0,0,1);
			this.texCoords.push( 0 + incS * j, 1.0);
		}

		var ind = 0;

		for (let i = 0; i < this.stacks + 2; i++) {
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



	/**
	 * Used to update texture coordinates upon drawing. Not required for this object.
	 * @param {Number} length_s scale factor (length)
	 * @param {Number} length_t scale factor (width)
	 */
	updateTexCoords(length_s, length_t) {

	}
};