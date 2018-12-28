class WindowGrid extends CGFobject {
    constructor(scene) {
        super(scene);

        this.door_window = new Cube(this.scene);
        this.window_grid = new MyCylinder(this.scene, 0.05, 0.05, 1, 20, 20);
    }

    display() {

        //window
        this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.scale(2.25,0.25,0.5);
        this.door_window.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.scale(2.25,0.25,0.5);
        this.door_window.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1,0,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,0.25,0.5);
        this.door_window.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1,0,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.scale(1,0.25,0.5);
        this.door_window.display();
        this.scene.popMatrix();


        //window grid

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);

        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,-0.5);
        this.window_grid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.window_grid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5,0,-0.5);
        this.window_grid.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}