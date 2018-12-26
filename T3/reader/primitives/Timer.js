class Timer extends CGFobject {
    constructor(scene, maxTime, numbers){
        super(scene);

        this.numbers = numbers;

        this.base = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
    }

    display(){
        let units = this.scene.game.time % 10;
        let dozens = Math.floor(this.scene.game.time / 10);
        this.scene.pushMatrix();
        this.numbers[dozens].bind();
        this.base.display();
        this.numbers[dozens].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[units].bind();
        this.scene.translate(1,0,0);
        this.base.display();
        this.numbers[units].unbind();
        this.scene.popMatrix();
    }
}