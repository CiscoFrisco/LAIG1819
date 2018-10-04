/**
 * MyStairs
 * @param gl { WebGLRenderingContext }
 * @constructor
 */

class MyStairs extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene

	 */
    constructor(scene) {
        super(scene);
        this.stair = new MyUnitCubeQuad(scene);


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
        this.scene.translate(0, -3.3, 3.75);
        this.scene.scale(10, 2.4, 30);
        this.scene.stairsApp.apply();
        this.stair.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.translate(0, -1.0, 1.25);
        this.scene.scale(10, 2.4, 30);
        this.stair.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.translate(0, 1.3, -1.25);
        this.scene.scale(10, 2.4, 30);
        this.stair.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.translate(0, 3.5, -3.75);
        this.scene.scale(10, 2.4, 30);
        this.stair.display();
        this.scene.popMatrix();
    };
};