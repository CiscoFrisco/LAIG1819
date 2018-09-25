/**
 * My3DTrapeze
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class My3DTrapeze extends CGFobject {
	/**
	 * Builds a My3DTrapeze object centered on the origin
	 * 
	 * @param {CGFscene} scene CGFscene
	 * @param {Number} bigBase 
	 * @param {Number} smallBase 
	 * @param {Number} depth 
	 * @param {Number} height 
	 * @param {Number} offset 
	 * @param {Number} minS minimum s texture coordinate
	 * @param {Number} maxS maximum s texture coordinate
	 * @param {Number} minT minimum t texture coordinate
	 * @param {Number} maxT maximum t texture coordinate
	 */
	constructor(scene, bigBase = 1, smallBase = 0.5, depth = 1, height = 1, offset = 0, minS = 0, maxS = 1, minT = 0, maxT = 1) {
		super(scene);

		this.depth = depth;
		this.height = height;
		this.offset = offset;
		this.smallBase = smallBase;
		this.bigBase = bigBase;

		this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;

		this.angle_R = 0;
		this.angle_L = 0;

		if (smallBase + offset > bigBase) {
			this.angle_R = -Math.atan((smallBase + offset - bigBase) / height);
		} else {
			this.angle_R = Math.atan((bigBase - (smallBase + offset)) / height);
		}

		if (offset > 0) {
			this.angle_L = Math.atan(height / offset) + Math.PI / 2.0;
		} else {
			this.angle_L = Math.atan(-offset / height) + Math.PI;
		}

		this.xRight = Math.cos(this.angle_R);
		this.yRight = Math.sin(this.angle_R);
		this.xLeft = Math.cos(this.angle_L);
		this.yLeft = Math.sin(this.angle_L);

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
	initBuffers() {
		//mapping 3 vertices in the same coordinates due to the texture application
		this.vertices = [-(this.bigBase) / 2.0, -(this.height) / 2.0, this.depth / 2, //front
			-(this.bigBase) / 2.0, -(this.height) / 2.0, this.depth / 2, //side
			-(this.bigBase) / 2.0, -(this.height) / 2.0, this.depth / 2, //bottom

			(this.bigBase) / 2.0, -(this.height) / 2.0, this.depth / 2, //front
			(this.bigBase) / 2.0, -(this.height) / 2.0, this.depth / 2, //other side
			(this.bigBase) / 2.0, -(this.height) / 2.0, this.depth / 2, //bottom

			-(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, this.depth / 2, //front
			-(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, this.depth / 2, //side
			-(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, this.depth / 2, //top

			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, this.depth / 2, //front
			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, this.depth / 2, //other side
			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, this.depth / 2, //top

			-(this.bigBase) / 2.0, -(this.height) / 2.0, -this.depth / 2, //back
			-(this.bigBase) / 2.0, -(this.height) / 2.0, -this.depth / 2, //side
			-(this.bigBase) / 2.0, -(this.height) / 2.0, -this.depth / 2, //bottom

			(this.bigBase) / 2.0, -(this.height) / 2.0, -this.depth / 2, //back
			(this.bigBase) / 2.0, -(this.height) / 2.0, -this.depth / 2, //other side
			(this.bigBase) / 2.0, -(this.height) / 2.0, -this.depth / 2, //bottom

			-(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, -this.depth / 2, //back
			-(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, -this.depth / 2, //side
			-(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, -this.depth / 2, //top

			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, -this.depth / 2, //back
			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, -this.depth / 2, //other side
			(this.smallBase) / 2.0 + this.offset, (this.height) / 2.0, -this.depth / 2, //top
		];

		this.indices = [

			//front
			0, 3, 6,
			9, 6, 3,

			//back
			12, 18, 15,
			21, 15, 18,

			//side
			13, 1, 7,
			19, 13, 7,

			//other side
			4, 16, 10,
			22, 10, 16,

			//top
			8, 11, 20,
			23, 20, 11,

			//bottom
			2, 14, 5,
			17, 5, 14,
		];


		this.texCoords = [
			//map each vertice coordinates
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.minS, this.minT,

			this.maxS, this.maxT,
			this.minS, this.maxT,
			this.maxS, this.minT,

			this.minS, this.minT,
			this.maxS, this.minT,
			this.minS, this.maxT,

			this.maxS, this.minT,
			this.minS, this.minT,
			this.maxS, this.maxT,

			this.maxS, this.maxT,
			this.minS, this.maxT,
			this.minS, this.maxT,

			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.maxS, this.maxT,

			this.maxS, this.minT,
			this.minS, this.minT,
			this.minS, this.minT,

			this.minS, this.minT,
			this.maxS, this.minT,
			this.maxS, this.minT,
		];

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.normals = [
			//map each vertice coordinate 
			0, 0, 1, -1, 0, 0,
			0, -1, 0,

			0, 0, 1,
			1, 0, 0,
			0, -1, 0,

			0, 0, 1, -1, 0, 0,
			0, 1, 0,

			0, 0, 1,
			1, 0, 0,
			0, 1, 0,

			0, 0, -1, -1, 0, 0,
			0, -1, 0,

			0, 0, -1,
			1, 0, 0,
			0, -1, 0,

			0, 0, -1, -1, 0, 0,
			0, 1, 0,

			0, 0, -1,
			1, 0, 0,
			0, 1, 0,

		];

		this.initGLBuffers();
	};

};