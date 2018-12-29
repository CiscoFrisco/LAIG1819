class Score extends CGFobject {
    constructor(scene, numbers) {
        super(scene);

        this.numbers = numbers;
        this.base = new MyQuad(this.scene, -1.5, -0.5, -0.5, 0.5);
        this.texture = new CGFtexture(this.scene, 'scenes/images/score.png')
    }

    display() {
        let units = this.scene.game.score % 10;
        let dozens = Math.floor(this.scene.game.score / 10) % 10;
        let hundreds = Math.floor(this.scene.game.score / 100);

        this.scene.pushMatrix();
        this.texture.bind();
        this.scene.translate(3,1,0);
        this.scene.scale(3,1,1);
        this.base.display();
        this.texture.unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[hundreds].bind();
        this.base.display();
        this.numbers[hundreds].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[dozens].bind();
        this.scene.translate(1, 0, 0);
        this.base.display();
        this.numbers[dozens].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[units].bind();
        this.scene.translate(2, 0, 0);
        this.base.display();
        this.numbers[units].unbind();
        this.scene.popMatrix();
    }
}