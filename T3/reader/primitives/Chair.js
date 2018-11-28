class Chair extends CGFobject {
    constructor(scene) {
        super(scene);

        this.outCP = [
            [
                [-0.5, 1.0, -1.0, 1.0],
                [-0.6, 0.8, -0.8, 1.0],
                [-0.7, 0.3, 0.0, 1.0],
                [-0.6, 0.8, 0.8, 1.0],
                [-0.5, 1.0, 1.0, 1.0]

            ],
            [
                [0.0, 0.8, -1.2, 1.0],
                [0.0, 0.6, -1.0, 1.0],
                [0.0, 0.1, 0.0, 1.0],
                [0.0, 0.6, 1.0, 1.0],
                [0.0, 0.8, 1.2, 1.0]
            ],
            [
                [0.5, 0.8, -1.4, 1.0],
                [0.5, 0.5, -1.2, 1.0],
                [0.5, 0.3, 0.0, 1.0],
                [0.5, 0.5, 1.2, 1.0],
                [0.5, 0.8, 1.4, 1.0]   
            ],
            [
                [1.0, 1.9, -1.2, 1.0],
                [1.2, 1.9, -1.0, 1.0],
                [1.5, 1.9, 0.0, 1.0],
                [1.2, 1.9, 1.0, 1.0],
                [1.0, 1.9, 1.2, 1.0]
            ],
            [
                [1.0, 2.1, -1.0, 1.0],
                [1.2, 2.1, -0.8, 1.0],
                [1.5, 2.1, 0.0, 1.0],
                [1.2, 2.1, 0.8, 1.0],
                [1.0, 2.1, 1.0, 1.0]   
            ]
        ];

        this.inCP = [
            [
                [-0.5, 1.0, 1.0, 1.0],
                [-0.6, 0.8, 0.8, 1.0],
                [-0.7, 0.3, 0.0, 1.0],
                [-0.6, 0.8, -0.8, 1.0],
                [-0.5, 1.0, -1.0, 1.0]

            ],
            [
                [0.0, 0.8, 1.2, 1.0],
                [0.0, 1.0, 1.0, 1.0],
                [0.0, 0.3, 0.0, 1.0],
                [0.0, 1.0, -1.0, 1.0],
                [0.0, 0.8, -1.2, 1.0]
            ],
            [
                [0.5, 0.8, 1.4, 1.0],
                [0.5, 0.9, 1.2, 1.0],
                [0.5, 0.7, 0.0, 1.0],
                [0.5, 0.9, -1.2, 1.0],
                [0.5, 0.8, -1.4, 1.0]   
            ],
            [
                [1.0, 1.9, 1.2, 1.0],
                [0.8, 1.9, 1.0, 1.0],
                [1.5, 1.9, 0.0, 1.0],
                [0.8, 1.9, -1.0, 1.0],
                [1.0, 1.9, -1.2, 1.0]
            ],
            [
                [1.0, 2.1, 1.0, 1.0],
                [1.2, 2.1, 0.8, 1.0],
                [1.5, 2.1, 0.0, 1.0],
                [1.2, 2.1, -0.8, 1.0],
                [1.0, 2.1, -1.0, 1.0]   
            ]
        ];


        this.baseCP = [
            [
                [0.0, 0.0, 0.5, 1.0],
                [0.0, 0.05, 0.4, 1.0],
                [0.0, 0.1, 0.3, 1.0],
                [0.0, 0.2, 0.2, 1.0],
                [0.0, 0.8, 0.05, 1.0]

            ],
            [
                [0.25, 0.0, 0.25, 1.0],
                [0.20, 0.05, 0.20, 1.0],
                [0.15, 0.1, 0.15, 1.0],
                [0.10, 0.2, 0.10, 1.0],
                [0.05, 0.8, 0.05, 1.0]
            ],
            [
                [0.5, 0.0, 0.0, 1.0],
                [0.4, 0.05, 0.0, 1.0],
                [0.3, 0.1, 0.0, 1.0],
                [0.2, 0.2, 0.0, 1.0],
                [0.05, 0.8, 0.0, 1.0]
            ]
        ];
        this.chair_out = new Patch(scene, 5, 5, 20, 20, this.outCP);
        this.chair_in = new Patch(scene, 5, 5, 20, 20, this.inCP);

        this.base = new Patch(this.scene, 3, 5, 20, 20, this.baseCP);

        this.initTextures();
    }

    initTextures() {

        this.baseTexture = new CGFappearance(this.scene);
        this.baseTexture.setAmbient(0.75, 0.75, 0.75, 1.0);
        this.baseTexture.setDiffuse(0.75, 0.75, 0.75, 1.0);

        this.chairTexture = new CGFappearance(this.scene);
        this.chairTexture.setAmbient(0.1, 0.1, 0.25, 1.0);
        this.chairTexture.setDiffuse(0.1, 0.1, 0.25, 1.0);

    };

    display() {

        this.baseTexture.apply();
        this.scene.pushMatrix();
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(3 * Math.PI / 2, 0, 1, 0);
        this.base.display();
        this.scene.popMatrix();

        this.chairTexture.apply();
        this.scene.pushMatrix();
        this.scene.translate(0,0.1,0);
        this.chair_out.display();
        this.chair_in.display();
        this.scene.popMatrix();


    }
}