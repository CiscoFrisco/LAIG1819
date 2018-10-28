class Plane extends CGFobject {
    constructor(scene, nPartsU, nPartsV){
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        // TODO: xOz
        var nurbsSurface = new CGFnurbsSurface(1, 1, [ // U = 0
            [ // V = 0..1;
                [-1.0, 0.0, -1.0, 1],
                [-1.0, 0.0, 1.0, 1]

            ],
            // U = 1
            [ // V = 0..1
                [1.0, -1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1]
            ]
        ]);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);

        this.initBuffers();
    }
}