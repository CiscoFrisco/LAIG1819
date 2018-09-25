/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


class MyUnitCubeQuad extends CGFobject {

    /**
     * Builds a MyUnitCubeQuad object, composed of a MyQuad that is translated/rotated
     * accordingly.
     * 
     * @param {CGFscene} scene 
     */
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(this.scene);
        this.quad.initBuffers();
    };

    /**
     * Displays this object
     */
    display() {

        //face paralela ao plano xOy em z = -0.5

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        //face paralela ao plano xOy em z = 0.5

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        //face paralela ao plano xOz em y = -0.5

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2.0, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        //face paralela ao plano xOz em y = 0.5

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);
        this.quad.display();
        this.scene.popMatrix();

        //face paralela ao plano yOz em x = -0.5

        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2.0, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();

        //face paralela ao plano yOz em x = -0.5

        this.scene.pushMatrix();
        this.scene.translate(-0.50, 0, 0);
        this.scene.rotate(-Math.PI / 2.0, 0, 1, 0);
        this.quad.display();
        this.scene.popMatrix();
    }
}