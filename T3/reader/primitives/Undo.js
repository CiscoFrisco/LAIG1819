class Undo extends CGFobject {
    constructor(scene) {
        super(scene);

        this.base = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.texture = new CGFtexture(this.scene, 'scenes/images/undo.png')
        this.id = 51;
    }

    display() {

        this.scene.pushMatrix();

        this.texture.bind();
        this.scene.scale(2, 2, 0.5);
        this.scene.registerForPick(this.id, this.base);
        this.base.display();
        this.texture.unbind();

        this.scene.popMatrix();
    }
}