class Rotate extends CGFobject {
    constructor(scene) {
        super(scene);

        this.base = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.texture = new CGFtexture(this.scene, 'scenes/images/rotate.png')
        this.id = 50;
    }

    display() {

        this.logPicking();

        this.scene.pushMatrix();

        this.texture.bind();
        this.scene.registerForPick(this.id, this.base);
        this.base.display();
        this.texture.unbind();

        this.scene.popMatrix();
    }
}