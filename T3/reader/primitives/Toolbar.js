class Toolbar extends CGFobject{
    constructor(scene, numbers){
        super(scene);

        this.timer = new Timer(scene, 30, numbers);
        this.score = new Score(scene, numbers);
        this.rotate = new Rotate(scene);
        this.undo = new Undo(scene);
    }

    display(){

        // this.scene.pushMatrix();
        // this.scene.translate(2, 1, 0);
        // this.timer.display();
        // this.scene.popMatrix();

        // this.scene.pushMatrix();
        // this.scene.translate(2, 1, 0);
        // this.score.display();
        // this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2, 1, 0);
        this.rotate.display();
        this.scene.popMatrix();

        // this.scene.pushMatrix();
        // this.scene.translate(2, 1, 0);
        // this.undo.display();
        // this.scene.popMatrix();
    }  
}