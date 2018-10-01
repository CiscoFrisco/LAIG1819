/**
 * MyStage
 * @param gl { WebGLRenderingContext }
 * @constructor
 */

class MyStage extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene
	 * @param {Number} height ramp height
	 * @param {Number} length ramp length
     * @param {Number} width ramp width

	 */
    constructor(scene) {
        super(scene);
        this.sides = new MyRamp(scene,1,1,1);
        this.middle = new MyUnitCubeQuad(scene);


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
       this.scene.translate(0,0,-1)
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.sides.display();
       this.scene.popMatrix();

       this.scene.pushMatrix();
        this.scene.translate(0,0,1)
        this.scene.rotate(Math.PI/2, 1,0,0);
        this.sides.display();
       this.scene.popMatrix();

       this.scene.pushMatrix();
        this.middle.display();
       this.scene.popMatrix();
    };
};