/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

// TODO: radius

class MySphere extends CGFobject {
	/**
	 * Builds a MySphere object.
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} radius radius of the sphere
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
		var beta = Math.PI/this.stacks;
		var alpha = 2 * Math.PI / this.slices;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;

		var incS = 1.0 / this.slices;
		var incT = 1.0 / this.stacks;

		for (let i = 0; i <= this.stacks; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(- Math.cos(j * alpha) * Math.sin(i*beta), -Math.sin(j * alpha) * Math.sin(i*beta), -Math.cos(i*beta));
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), -Math.cos(i*beta));
				this.texCoords.push(1.0 - incS * j, 0.0 + incT * i);
			}
		}

		var ind = 0;

		for (let i = 0; i < this.stacks; i++) {
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
	 * Displays this object according to its radius.
	 */
	display() {
		this.scene.pushMatrix();
		this.scene.scale(this.radius, this.radius, this.radius);
		this.drawElements(this.scene.gl.TRIANGLES);
		this.scene.popMatrix();
	}

	/**
	 * Used to update texture coordinates upon drawing. Not required for this object.
	 * @param {Number} length_s scale factor (length)
	 * @param {Number} length_t scale factor (width)
	 */
	updateTexCoords(length_s, length_t) {

	}
};