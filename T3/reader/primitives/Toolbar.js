class Toolbar extends CGFobject {
    constructor(scene, numbers, undo, movie, rotate) {
        super(scene);

        this.timer = new Timer(scene, this.scene.game.maxTime, numbers);
        this.score = new Score(scene, numbers);
        this.rotate = new ToolbarItem(scene, rotate, 50);
        this.undo = new ToolbarItem(scene, undo, 51);
        this.movie = new ToolbarItem(scene, movie, 52);
    }

    display() {

        if (this.scene.game.gameState > 2) {
            this.scene.pushMatrix();
            this.scene.translate(-4, -0.5, 0);
            this.score.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(-1.5, -0.5, 0);
            this.timer.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(0.5, 0, 0);
            this.scene.scale(2, 2, 1);
            this.rotate.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(2.5, 0, 0);
            this.scene.scale(2, 2, 1);
            this.undo.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(4.5, 0, 0);
            this.scene.scale(2, 2, 1);
            this.movie.display();
            this.scene.popMatrix();
        }
    }
}