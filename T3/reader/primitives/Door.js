class Door extends CGFobject {
    constructor(scene) {
        super(scene);

        this.door_side1CP = [
            [
                [0.5,-0.3,0.0,1.0],
                [-0.5,-0.3,0.0,1.0]
            ],
            [
                [0.5,0.0,0.0,1.0],
                [-0.5,0.0,0.0,1.0]
            ],
            [
                [0.45,0.3,0.0,1.0],
                [-0.5,0.3,0.0,1.0]
            ],
            [
                [0.4,0.6,0.0,1.0],
                [-0.5,0.6,0.0,1.0]
            ],
            [
                [0.35,0.9,0.0,1.0],
                [-0.5,0.9,0.0,1.0]
            ],
            [
                [0.3,1.2,0.0,1.0],
                [-0.5,1.2,0.0,1.0]
            ],
            [
                [-0.5,1.5,0.0,1.0],
                [-0.5,1.5,0.0,1.0]
            ],
        ];

        this.door_side2CP = [
            [
                [-0.5,-0.3,0.0,1.0],
                [0.5,-0.3,0.0,1.0]
            ],
            [
                [-0.5,0.0,0.0,1.0],
                [0.5,0.0,0.0,1.0]
            ],
            [
                [-0.5,0.3,0.0,1.0],
                [0.45,0.3,0.0,1.0]
            ],
            [
                [-0.5,0.6,0.0,1.0],
                [0.4,0.6,0.0,1.0]
            ],
            [
                [-0.5,0.9,0.0,1.0],
                [0.35,0.9,0.0,1.0]
            ],
            [
                [-0.5,1.2,0.0,1.0],
                [0.3,1.2,0.0,1.0]
            ],
            [
                [-0.5,1.5,0.0,1.0],
                [-0.5,1.5,0.0,1.0]
            ],
        ];

        this.door_upCP = [
            [
                [-1.0,0.8,0.0,1.0],
                [-1.0,0.0,0.0,1.0]
            ],
            [
                [-0.5,1.0,0.0,1.0],
                [-0.5,0.0,0.0,1.0]
            ],
            [
                [0.0,1.1,0.0,1.0],
                [0.0,0.0,0.0,1.0]
            ],
            [
                [0.5,1.0,0.0,1.0],
                [0.5,0.0,0.0,1.0]
            ],
            [
                [1.0,0.8,0.0,1.0],
                [1.0,0.0,0.0,1.0]
            ],
        ];


        this.up_door_side1 = new Patch(scene, 7, 2, 10, 10, this.door_side1CP);
        this.up_door_side2 = new Patch(scene, 7, 2, 10, 10, this.door_side2CP);
        this.up_door =  new Patch(scene, 5, 2, 10, 10, this.door_upCP);

        this.window_grid = new WindowGrid(this.scene);
        this.down_door = new Cube(this.scene);
        this.door_frame_bricks = new Cube(this.scene);
        this.initTextures();
    }

    initTextures() {
        this.doorTexture = new CGFappearance(this.scene);
        this.doorTexture.setAmbient(0.361, 0.171, 0.076, 1.0);
        this.doorTexture.setDiffuse(0.661, 0.271, 0.0176, 1.0);

        this.gridTexture = new CGFappearance(this.scene);
        this.gridTexture.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.gridTexture.setDiffuse(0.1, 0.1, 0.1, 1.0);
    };

    display() {

        this.gridTexture.apply();

        this.scene.pushMatrix();
        this.scene.translate(0,4.4,0);
        this.window_grid.display();
        this.scene.popMatrix();

        this.doorTexture.apply();

        this.scene.pushMatrix();
        this.scene.translate(0,2.0,0);
        this.scene.scale(4,4.0,0.4);
        this.down_door.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.5,4.3,0.2);
        this.up_door_side1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.5,4.3,-0.2);
        this.up_door_side2.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(-1.5,4.3,-0.2);
        this.scene.rotate(Math.PI,0,1,0);
        this.up_door_side1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.5,4.3,0.2);
        this.scene.rotate(Math.PI,0,1,0);
        this.up_door_side2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,5.0,-0.2);
        this.up_door.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,5.0,0.2);
        this.scene.rotate(Math.PI,0,1,0);
        this.up_door.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.2,0.25,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,0.25,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(-2.2,0.8,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,0.8,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.2,1.35,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,1.35,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.2,1.9,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,1.9,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.2,2.45,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,2.45,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.2,3.0,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,3.0,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.2,3.55,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,3.55,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.05,4.9,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/12,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.05,4.9,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/12,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.75,5.55,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/4,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.75,5.55,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/4,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.0,6.0,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/3,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.0,6.0,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/3,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,6.2,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();
    }
}