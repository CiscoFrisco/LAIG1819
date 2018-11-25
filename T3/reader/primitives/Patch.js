/**
 * Patch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Patch extends CGFobject {
    /**
     * Build a Patch object, using NURBS.
     * 
     * @param {CGFscene} scene main scene
     * @param {Number} nPointsU number of control points on U domain
     * @param {Number} nPointsV number of control points on V domain
     * @param {Number} nPartsU division in parts on U domain
     * @param {Number} nPartsV division in parts on V domain
     * @param {Array} controlPoints array of control points
     */
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);

        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;

        var nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);
    }

    /**
     * Display this object.
     */
    display(){
        this.obj.display();
    }
}