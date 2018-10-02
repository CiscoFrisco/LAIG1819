/**
 * MyChairs
 * @param gl { WebGLRenderingContext }
 * @constructor
 */

class MyChairs extends CGFobject {
	/**
	 * Builds a MyBumber object, destined to be used in MyVehicle
	 * 
	 * @param {GGFscene} scene CGFscene
	 * @param {Number} height ramp height
	 * @param {Number} length ramp length
     * @param {Number} width ramp width

	 */
    constructor(scene, size, number) {
        super(scene);

        this.size = size;
        this.number = number;
        this.inc = 3 / 2 * this.size;

        this.chair = new MyChair(scene);


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

        var translate_x = 0;
        var translate_z = 0;
        var chairs = this.number;
        var row = 10;
            
        while(chairs > 0){

            if(chairs < 10)
              row = chairs;    
            
            for (let j = 0; j < row; j++) {
                
                this.scene.pushMatrix();
                    this.scene.translate(translate_x, 0, translate_z);
                    this.scene.scale(this.size, this.size, this.size);
                    this.chair.display();
                this.scene.popMatrix();

                translate_x += this.inc;
            }
            chairs -= row;
            translate_x = 0;
            translate_z -= 1.5*this.inc;
        }

        row = 10;
    };
};