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
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, inner, outer, slices, sides, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.slices = slices;
        this.sides = sides;
        this.inner = inner;
        this.outer = outer;

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
	initBuffers() {
        var alpha = 2 * Math.PI / this.slices;
        var beta = 2 * Math.PI/this.sides;
        var radius = (this.outer-this.inner)/2;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var incS = (this.maxS - this.minS) / this.slices;
		var incT = (this.maxT - this.minT) / this.sides;

		for (let i = 0; i <= this.sides; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * radius, Math.cos(z)*this.inner + Math.sin(j*alpha) * Math.cos(z) * radius, Math.sin(z)*this.inner + Math.sin(j*alpha) * Math.sin(z) * radius);
				this.normals.push(Math.cos(j * alpha), Math.sin(j*alpha) * Math.cos(z), Math.sin(j*alpha) * Math.sin(z));
                this.texCoords.push(this.maxS - incS * j, this.minT + incT * i);
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
};