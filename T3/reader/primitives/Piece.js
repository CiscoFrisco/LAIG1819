class Piece extends CGFobject {
    constructor(scene, appearance){
        super(scene);

        this.cylinder = new MyCylinder(scene, 0.3, 0.3, 0.15, 20, 20);
        this.appearance = appearance;
    }

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }
}