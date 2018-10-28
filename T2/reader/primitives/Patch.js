class Patch extends CGFobject {
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);

        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;

        // TODO: xOz
        var nurbsSurface = new CGFnurbsSurface(this.nPointsU, this.nPointsV, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);

        this.initBuffers();
    }
}