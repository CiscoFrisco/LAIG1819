class Torch extends CGFobject {
    constructor(scene) {
        super(scene);


        this.torch = new CGFOBJModel(this.scene, 'scenes/models/piece.obj');

        this.outCP = [
            [
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0]
            ],
            [
                [0.25, 0.25, 0.2, 1.0],
                [0.25, 0.25, 0.0, 1.0],
                [0.25, 0.25, -0.2, 1.0]
            ],

            [
                [0.5, 0.5, 0.4, 1.0],
                [0.5, 0.5, 0.0, 1.0],
                [0.5, 0.5, -0.4, 1.0]
            ],
            [
                [1.0, 1.0, 0.2, 1.0],
                [1.0, 1.0, 0.0, 1.0],
                [1.0, 1.0, -0.2, 1.0]
            ],
            [
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0]
            ]
        ];

       /* this.inCP = [
            [
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0]
            ],
            [
                [0.5, 0.5, -0.2, 1.0],
                [0.5, 0.5, 0.0, 1.0],
                [0.5, 0.5, 0.2, 1.0]
            ],

            [
                [0.75, 0.75, -0.4, 1.0],
                [0.75, 0.75, 0.0, 1.0],
                [0.75, 0.75, 0.4, 1.0]
            ],
            [
                [1.0, 1.0, -0.2, 1.0],
                [1.0, 1.0, 0.0, 1.0],
                [1.0, 1.0, 0.2, 1.0]
            ],
            [
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0]
            ]
        ];*/
        
        this.initTextures();

        this.leaf_out = new Patch(scene, 5, 3, 10, 10, this.outCP);
       // this.leaf_in = new Patch(scene, 5, 3, 10, 10, this.inCP);

        this.rim = new MyTorus(scene, 0.05, 0.45, 20, 20);
        this.vase = new MyCylinder(this.scene, 0.15, 0.25, 1.5, 20, 20);
    }

    initTextures() {
        this.baseTexture = new CGFappearance(this.scene);
        this.baseTexture.loadTexture("scenes/images/torch.jpg");


        this.clothTexture = new CGFappearance(this.scene);
        this.clothTexture.loadTexture("scenes/images/cloth.jpg");

        this.flame1Texture = new CGFappearance(this.scene);
        this.flame1Texture.setAmbient(1.0, 1.0, 0.2, 1.0);
        this.flame1Texture.setDiffuse(1.0, 1.0, 0.2, 1.0);

        this.flame2Texture = new CGFappearance(this.scene);
        this.flame2Texture.setAmbient(1.0, 0.549, 0.0, 1.0);
        this.flame2Texture.setDiffuse(1.0, 0.549, 0.0, 1.0);
        
        this.flame3Texture = new CGFappearance(this.scene);
        this.flame3Texture.setAmbient(1.0, 0.271, 0.0, 1.0);
        this.flame3Texture.setDiffuse(1.0, 0.271, 0.0, 1.0);
    };

    display() {

        /*this.baseTexture.apply();
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.vase.display();
        this.scene.popMatrix();

        this.clothTexture.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 1.4, 0);
        this.scene.scale(0.6, 2, 0.6);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.rim.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1.2, 0);
        this.scene.scale(0.55, 2, 0.55);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.rim.display();
        this.scene.popMatrix();

        this.scene.pushMatrix()
        this.scene.translate(0, 1.5, 0);

        var k = 0;
        for (let i = 0; i <= 7; i++ , k++) {

            switch(i/2){
                case 0:
                    console.log(i/2);
                    this.flame1Texture.apply();
                    break;
                case 1:
                    console.log(i/2);
                    this.flame2Texture.apply();
                    break;
                case 2:
                    console.log(i/2);
                    this.flame3Texture.apply();
                    break;
                default:
                    break;
            }

            for (let j = k * 0.5; j < 4; j++) {*/
                this.scene.pushMatrix();
                // this.scene.translate(0, i * 0.2, 0);
                // this.scene.rotate(j * Math.PI / 2, 0, 1, 0);
                // this.scene.rotate(k * Math.PI / 20, 0, 0, 1);
                this.torch.display();
                //this.leaf_in.display();
                this.scene.popMatrix();
        //     }
        // }

        // this.scene.popMatrix();

    }
}