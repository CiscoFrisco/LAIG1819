/**
 * MyChair
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyChair extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene
	 */
	constructor(scene) {
		super(scene);

        this.cube = new MyUnitCubeQuad(scene);
        this.cylinder = new MyCylinderCovered(scene, 20, 20);
       
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
            this.scene.translate(0,1,0);
            this.scene.scale(1,0.1,1);
            this.cube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.40,1,0.40);
            this.scene.scale(0.05,1,0.05);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-0.40,2.1,-0.50);
            this.scene.scale(0.05,2,0.05);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-0.40,1,0.40);
            this.scene.scale(0.05,1,0.05);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.40,2.1,-0.50);
            this.scene.scale(0.05,2,0.05);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,1.75,-0.50);
            this.scene.scale(1,0.5,0.1);
            this.cube.display();
        this.scene.popMatrix();

	};
};