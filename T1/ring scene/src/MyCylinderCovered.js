/**
 * MyCylinderCovered
 * @param gl {WebGLRenderingContext}
 * @constructor
 */


class MyCylinderCovered extends CGFobject {

    /**
     * Builds a MyCylinderCovered object, with bases on both sides
     * 
     * @param {CGFscene} scene CGFscene
     * @param {Number} slices number of slices
     * @param {Number} stacks number of stacks
     */
    constructor(scene, slices, stacks) {
        super(scene);
        this.cylinder = new MyCylinder(scene, slices, stacks);
        this.circle = new MyPoligon(scene, slices);
        this.stacks = stacks;
    };

    /**
     * Displays this object
     */
    display() {
        //Regular cylinder
        this.scene.pushMatrix();
        this.cylinder.display();
        this.scene.popMatrix();

        //Base 1
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);
        this.circle.display();
        this.scene.popMatrix();

        //Base 2
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.circle.display();
        this.scene.popMatrix();
    }
}