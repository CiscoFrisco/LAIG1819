/**
 * Plane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class Plane extends CGFobject {
    /**
     * Build a Plane object using NURBS.
     * 
     * @param {CGFscene} scene main scene 
     * @param {Number} nPartsU division in parts on U domain
     * @param {Number} nPartsV division in parts on V domain
     */
    constructor(scene, nPartsU, nPartsV) {
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        var nurbsSurface = new CGFnurbsSurface(1, 1, [
            [
                [0.5, 0.0, -0.5, 1],
                [0.5, 0.0, 0.5, 1]

            ],
            [
                [-0.5, 0.0, -0.5, 1],
                [-0.5, 0.0, 0.5, 1]
            ]
        ]);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);
    }

    /**
     * Display this object.
     */
    display() {
        this.obj.display();
    }
}