/**
 * MyRamp
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRamp extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene
	 * @param {Number} height ramp height
	 * @param {Number} length ramp length
     * @param {Number} width ramp width

	 */
	constructor(scene, height, length, width) {
		super(scene);

        this.height = height;
        this.length = length;
        this.width = width;

        this.ramp_side = new MyTriangle(scene);
        this.ramp_top = new MyQuad(scene);
		//texture limits
		/*this.minS = minS;
		this.maxS = maxS;
		this.minT = minT;
		this.maxT = maxT;*/

	};

	/**
	 * Initializes vertices, normals, indices and texture coordinates.
	 */
	display() {

        this.scene.pushMatrix();
            this.scene.translate(0,0,this.width/2);
            this.scene.scale(this.length, this.height,1);
            this.ramp_side.display();
        this.scene.popMatrix();

        
        this.scene.pushMatrix();
            this.scene.translate(0,0,-this.width/2);
            this.scene.scale(this.length, this.height,1);
            this.ramp_side.display();
        this.scene.popMatrix();

        //top
        this.scene.pushMatrix();
            this.scene.rotate(-Math.atan(this.height/this.length),0,0,1);
            this.scene.scale(Math.sqrt(this.length*this.length + this.height*this.height), 1, this.width);
            this.scene.rotate(-Math.PI/2, 1,0,0);
            this.ramp_top.display();
        this.scene.popMatrix();

        //down
        this.scene.pushMatrix();
            this.scene.translate(0,-this.height/2 ,0);
            this.scene.scale(this.length, 1, this.width);
            this.scene.rotate(Math.PI/2, 1,0,0);
            this.ramp_top.display();
        this.scene.popMatrix();

        //quad side

        //end
        this.scene.pushMatrix();
            this.scene.translate(-this.length/2,0,0);
            this.scene.scale(1, this.height, this.width);
            this.scene.rotate(-Math.PI/2,0,1,0);
            this.ramp_top.display();
        this.scene.popMatrix();


	};
};