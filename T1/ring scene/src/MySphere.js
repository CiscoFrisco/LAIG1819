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
		var alpha = 2 * Math.PI / this.slices;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;
		var raio = 1;
		var incS = 1.0 / this.slices;
		var incT = 1.0 / this.stacks;
		
		//metade inferior da esfera
		for (var i = 0; i < this.stacks / 2; i++) {
			if (i > 0)
				raio = Math.cos(Math.asin(z));

			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);
				this.texCoords.push(1 - incS*j, 0.5 + incT*i);
			}

			z += 1 / (this.stacks / 2);
		}
		
		for(let i = 0; i <= this.slices; i++ ){
			this.vertices.push(0, 0, z);
			this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), raio);
			this.texCoords.push(1 - incS*i, 1);
		}

		//metade superior da esfera
		var z = 0;
		var raio = 1;

		for (var i = 0; i < this.stacks / 2; i++) {
			if (i > 0)
				raio = Math.cos(Math.asin(z));

			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, -z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), -raio);
				this.texCoords.push(1- incS*j, 0.5 - incT*i);
			}

			z += 1 / (this.stacks / 2);
		}

		for(let i = 0; i <= this.slices; i++ ){
			this.vertices.push(0, 0, -z);
			this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), -raio);
			this.texCoords.push(1 - incS*i, 0);
		}

		
		
		//indices
		var ind = 0;

		for (var i = 0; i <= this.stacks / 2; i++) {
			for (var j = 0; j < this.slices; j++) {
				
				this.indices.push(ind, ind + 1, ind + this.slices + 1);
				this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
				ind++;
			}
		}


		for (var i = 0; i <= this.stacks / 2; i++) {
			for (var j = 0; j < this.slices; j++) {
				
				this.indices.push(ind, ind + this.slices + 1, ind + 1);
				this.indices.push(ind + this.slices + 1, ind + this.slices + 2, ind + 1);
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