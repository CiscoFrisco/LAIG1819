/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject {
	/**
	 * Builds a MyCylinderRound object, used to make a wheel. 
	 * 
	 * @param {CGFScene} scene CGFscene
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

		this.circle = new MyPoligon(scene, slices);
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

		for (let i = 0; i <= this.stacks; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha) * raio, Math.sin(j * alpha) * raio, z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), z);
				this.texCoords.push(1.0 - incS * j, 0.0 + incT * i);
			}

			z += z_inc;
			raio += r_inc;
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

	updateTexCoords(length_s, length_t) {
		this.updateTexCoordsGLBuffers();
	}

	display() {

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.scale(this.base, this.base, 1);
		this.circle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.drawElements(this.scene.gl.TRIANGLES);
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.translate(0, 0, this.heigh);
		this.scene.scale(this.top, this.top, 1);
		this.circle.display();
		this.scene.popMatrix();

	}
};