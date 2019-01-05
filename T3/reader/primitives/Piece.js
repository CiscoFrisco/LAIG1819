class Piece extends CGFobject {
    constructor(scene, appearance, piece, rotate, scX, scY, scZ) {
        super(scene);

        this.piece = piece;
        this.rotate = rotate;
        this.appearance = appearance;

        this.scX = scX;
        this.scY = scY;
        this.scZ = scZ;
    }

    display() {
        this.scene.pushMatrix();
        this.appearance.apply();
        if (this.rotate)
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(this.scX, this.scY, this.scZ);
        this.piece.display();
        this.scene.popMatrix();
    }
}