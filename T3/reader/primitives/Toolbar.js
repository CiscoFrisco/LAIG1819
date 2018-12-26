class Toolbar extends CGFobject{
    constructor(scene, numbers){
        super(scene);

        this.timer = new Timer(scene, 30, numbers);
        this.score = new Score(scene, numbers);
        this.rotate = new Rotate(scene);
        // this.undo = new Undo(scene);
    }

    display(){

        this.scene.pushMatrix();
        this.timer.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(10, 0, 0);
        this.score.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(25, 0, 0);
        this.rotate.display();
        this.scene.popMatrix();

        // this.scene.pushMatrix();
        // this.undo.display();
        // this.scene.popMatrix();
    }

    update(deltaTime){
        this.timer.update(deltaTime);
    }   
}