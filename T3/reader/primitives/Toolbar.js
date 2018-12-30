class Toolbar extends CGFobject {
    constructor(scene, numbers, undo, movie, rotate) {
        super(scene);

        this.timer = new Timer(scene, this.scene.game.maxTime, numbers);
        this.score = new Score(scene, numbers);
        this.rotate = new ToolbarItem(scene, rotate, 50);
        this.undo = new ToolbarItem(scene, undo, 51);
        this.movie = new ToolbarItem(scene, movie, 52);
    }

    logPicking() {
        let picked = false;

        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];
                    if (obj) {
                        var customId = this.scene.pickResults[i][1];

                        if (customId >= 50 && customId <= 52) {
                            picked = true;

                            if (customId === 50)
                                this.scene.startRotation();
                            else if (customId === 51)
                                this.scene.game.undoMove();
                            else if (customId === 52)
                                this.scene.game.movieAnim();
                        }
                        console.log('Picked object: ' + obj + ', with pick id ' + customId);
                    }
                }
                if (picked)
                    this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    display() {

        if (this.scene.game.gameState > 2) {

            this.logPicking();

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