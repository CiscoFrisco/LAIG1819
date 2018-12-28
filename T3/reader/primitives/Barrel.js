class Barrel extends CGFobject {
    constructor(scene) {
        super(scene);

       
        
        this.initTextures();

        this.barrel = new MyCylinder(scene, 0.5, 0.9, 1, 8, 8);
        this.middle_rim = new MyTorus(scene, 0.05, 0.9, 8, 8);
        this.border_rim = new MyTorus(scene, 0.10, 0.5, 8, 8);
    }

    initTextures() {
        this.barrelTexture = new CGFappearance(this.scene);
        this.barrelTexture.loadTexture("scenes/images/torch.jpg");

        this.rimTexture = new CGFappearance(this.scene);
        this.rimTexture.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.rimTexture.setDiffuse(0.3, 0.3, 0.3, 1.0);
    };

    display() {


        this.scene.pushMatrix()
        this.barrelTexture.apply();
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.barrel.display();
        this.scene.popMatrix();

        this.scene.pushMatrix()
        this.barrelTexture.apply();
        this.scene.translate(0,2,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.barrel.display();
        this.scene.popMatrix();


        this.rimTexture.apply();

        this.scene.pushMatrix()
        this.scene.translate(0,0.1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.border_rim.display();
        this.scene.popMatrix();

        this.scene.pushMatrix()
        this.scene.translate(0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.middle_rim.display();
        this.scene.popMatrix();

        this.scene.pushMatrix()
        this.scene.translate(0,1.9,0);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.border_rim.display();
        this.scene.popMatrix();

    }
}