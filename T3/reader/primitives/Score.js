class Score extends CGFobject {
    constructor(scene, numbers) {
        super(scene);

        this.score = 0;
        this.numbers = numbers;
        this.base = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
    }

    display() {
        let units = this.score % 10;
        let dozens = Math.floor(this.score / 10) % 10;
        let hundreds = Math.floor(this.score / 100);

        this.scene.pushMatrix();
        this.numbers[hundreds].bind();
        this.scene.scale(5, 5, 1);
        this.base.display();
        this.numbers[hundreds].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[dozens].bind();
        this.scene.translate(5, 0, 0);
        this.scene.scale(5, 5, 1);
        this.base.display();
        this.numbers[dozens].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[units].bind();
        this.scene.translate(10, 0, 0);
        this.scene.scale(5, 5, 1);
        this.base.display();
        this.numbers[units].unbind();
        this.scene.popMatrix();
    }

    updateScore() {
        if (this.score == 999)
            this.score = 0;
        else
            ++this.score;
    }
}