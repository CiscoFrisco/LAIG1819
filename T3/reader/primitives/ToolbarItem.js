class ToolbarItem extends CGFobject {
    constructor(scene, texture, id) {
        super(scene);

        this.base = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.texture = texture;
        this.id = id;
    }

    display() {

        this.scene.pushMatrix();

        this.texture.bind();
        this.scene.registerForPick(this.id, this.base);
        this.base.display();
        this.texture.unbind();

        this.scene.popMatrix();
    }
}