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
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, base, top, height, slices, stacks, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

        this.base = base;
        this.tp = top;
        this.heigh = height;
        this.slices = slices;
		this.stacks = stacks;

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.circle = new MyPoligon(scene,slices);
		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
	initBuffers() {
        var z_inc = this.heigh/this.stacks;
        var alpha = 2 * Math.PI / this.slices;
        var raio = this.base;
        var r_inc = (this.tp - this.base)/this.stacks;
		
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var z = 0;

		var incS = (this.maxS - this.minS) / this.slices;
		var incT = (this.maxT - this.minT) / this.stacks;

		for (let i = 0; i <= this.stacks; i++) {
			for (var j = 0; j <= this.slices; j++) {
				this.vertices.push(Math.cos(j * alpha)*raio, Math.sin(j * alpha)*raio, z);
				this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), z);
				this.texCoords.push(this.maxS - incS * j, this.minT + incT * i);
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

	display(){

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI,0,1,0);
		this.scene.scale(this.base,this.base,1);
		this.circle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.drawElements(this.scene.gl.TRIANGLES)	;
		this.scene.popMatrix();



		this.scene.pushMatrix();
		this.scene.translate(0,0,this.heigh);
		this.scene.scale(this.tp,this.tp,1);
		this.circle.display();
		this.scene.popMatrix();

	}
};