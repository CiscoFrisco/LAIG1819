class Piece extends CGFobject {
    constructor(scene, appearance){
        super(scene);

		this.piece = new CGFOBJModel(this.scene, 'scenes/models/piece.obj', true);
        this.appearance = appearance;
    }

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.scale(0.4,0.2,0.4);
        this.piece.display();
        this.scene.popMatrix();
    }
}