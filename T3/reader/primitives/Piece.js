class Piece extends CGFobject {
    constructor(scene, appearance){
        super(scene);

        this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 20);
        this.appearance = appearance;
    }

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.cylinder.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }
}