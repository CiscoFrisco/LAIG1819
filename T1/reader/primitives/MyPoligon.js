/**
 * MyPoligon
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyPoligon extends CGFobject {
	/**
	 * Builds a MyPoligon object, used to create round covers for a cylinder.
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} slices number of slices
	 */
	constructor(scene, slices) {
		super(scene);
		this.slices = slices;

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

		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);

		for (let i = 0; i < this.slices; i++) {
			this.vertices.push(Math.cos(i * alpha), Math.sin(i * alpha), 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(0.5 + (Math.cos(i * alpha) / 2), 0.5 - (Math.sin(i * alpha) / 2))
		}

		var center = 0;

		for (let i = 0; i < this.slices; i++) {
			if (i == this.slices - 1)
				this.indices.push(center, i + 1, 1);
			else
				this.indices.push(center, i + 1, i + 2);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
};