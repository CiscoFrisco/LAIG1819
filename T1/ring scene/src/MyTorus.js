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
	constructor(scene, slices, sides, inner, outer, minS = 0, maxS = 1, minT = 0, maxT = 1) {
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

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var incS = (this.maxS - this.minS) / this.slices;
		var incT = (this.maxT - this.minT) / this.sides;

		for (let i = 0; i <= this.sides; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.sin(z)*this.outer + Math.sin(j*alpha) * Math.sin(z) * this.inner, Math.cos(z)*this.outer + Math.sin(j*alpha) * Math.cos(z) * this.inner, Math.cos(j * alpha) * this.inner );
				this.normals.push(Math.sin(j*alpha) * Math.sin(z), Math.sin(j*alpha) * Math.cos(z), Math.cos(j * alpha));
                this.texCoords.push(this.minS + incS * i, this.maxT - incT * j);
			}

			z += beta;
		}

		console.log(this.vertices);

		var ind = 0;

		for (let i = 0; i < this.sides; i++) {
			for (let j = 0; j <= this.slices; j++) {
				if (j != this.slices) {
					this.indices.push(ind, ind + this.slices + 1, ind + 1 );
					this.indices.push(ind + this.slices + 1, ind + this.slices + 2,  ind + 1);
				}
				ind++;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};