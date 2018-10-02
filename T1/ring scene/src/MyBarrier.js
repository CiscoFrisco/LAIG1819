/**
 * MyBarrier
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyBarrier extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene
	 * @param {Number} height ramp height
	 * @param {Number} length ramp length
     * @param {Number} width ramp width

	 */
	constructor(scene, height, radius, width) {
		super(scene);

        this.barrier = new MyUnitCubeQuad(scene);
        this.height = height;
        this.radius = radius;
        this.width = width;

       
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
            this.scene.translate(0,0, 4/3*this.radius);   
            this.scene.scale(2.2*this.radius,this.height,this.width)
            this.barrier.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0, -4/3*this.radius);   
            this.scene.scale(2.2*this.radius,this.height,this.width)
            this.barrier.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(52/50*this.radius,0, 0);   
            this.scene.rotate(Math.PI/2,0,1,0);
            this.scene.scale(8/3*this.radius,this.height,this.width)
            this.barrier.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-52/50*this.radius,0, 53/50*this.radius);  
            this.scene.rotate(Math.PI/2,0,1,0); 
            this.scene.scale(2*this.radius/3,this.height,this.width)
            this.barrier.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-52/50*this.radius,0, - 53/50*this.radius); 
            this.scene.rotate(Math.PI/2,0,1,0);
            this.scene.scale(2*this.radius/3,this.height,this.width)
            this.barrier.display();
        this.scene.popMatrix();

        



	};
};