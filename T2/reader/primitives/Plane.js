class Plane extends CGFobject {
    constructor(scene, nPartsU, nPartsV) {
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        var nurbsSurface = new CGFnurbsSurface(1, 1, [
            [
                [1.0, 0.0, -1.0, 1],
                [1.0, 0.0, 1.0, 1]

            ],
            [
                [-1.0, 0.0, -1.0, 1],
                [-1.0, 0.0, 1.0, 1]
            ]
        ]);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);

    }

    display() {
        this.obj.display();
    }
}