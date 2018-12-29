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
        this.barrelTexture = new CGFappearance(this.scene);
        this.barrelTexture.loadTexture("scenes/images/torch.jpg");

        this.frideTexture = new CGFappearance(this.scene);
        this.frideTexture.loadTexture("scenes/images/rusty.jpg");

        this.gridTexture = new CGFappearance(this.scene);
        this.gridTexture.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.gridTexture.setDiffuse(0.1, 0.1, 0.1, 1.0);

        this.doorFrameTexture = new CGFappearance(this.scene);
        this.doorFrameTexture.loadTexture("scenes/images/floor2.jpg");
    };

    display() {

        this.frideTexture.apply();

        this.scene.pushMatrix();
        this.scene.translate(0,4.4,0);
        this.window_grid.display();
        this.scene.popMatrix();

        this.barrelTexture.apply();

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

        this.doorFrameTexture.apply();

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
        this.scene.translate(-2.2,4.1,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,4.1,0);
        this.scene.scale(0.5,0.5,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.15,4.65,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/24,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.15,4.65,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/24,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2.075,5.075,0);
        this.scene.rotate(-Math.PI/10,0,0,1);
        this.scene.scale(0.5,0.25,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.075,5.075,0);
        this.scene.rotate(Math.PI/10,0,0,1);
        this.scene.scale(0.5,0.25,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.95,5.375,0);
        this.scene.rotate(-Math.PI/6,0,0,1);
        this.scene.scale(0.5,0.25,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.95,5.375,0);
        this.scene.rotate(Math.PI/6,0,0,1);
        this.scene.scale(0.5,0.25,0.5);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.6,5.715,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/3.25,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.6,5.715,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/3.25,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(-1.1,5.985,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/2.65,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.1,5.985,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/2.65,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.55,6.15,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(-Math.PI/2.25,0,0,1);
        this.door_frame_bricks.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.55,6.15,0);
        this.scene.scale(0.5,0.5,0.5);
        this.scene.rotate(Math.PI/2.25,0,0,1);
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