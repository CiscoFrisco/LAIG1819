class Cube extends CGFObject {
    contructor(scene, scaleX = 1, scaleY = 1, scaleZ = 1){
        super(scene);

        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;

        this.side1 = new MyQuad();
        this.side2 = new MyQuad();
        this.side3 = new MyQuad();
        this.side4 = new MyQuad();
        this.side5 = new MyQuad();
        this.side6 = new MyQuad();

        this.initBuffers();
    }

    display(){

        this.pushMatrix();

        this.scene.scale(scaleX, scaleY, scaleZ);

        this.pushMatrix();
        this.side1.display();
        this.popMatrix();

        this.pushMatrix();
        this.side2.display();
        this.popMatrix();

        this.pushMatrix();
        this.side3.display();
        this.popMatrix();

        this.pushMatrix();
        this.side4.display();
        this.popMatrix();

        this.pushMatrix();
        this.side5.display();
        this.popMatrix();

        this.pushMatrix();
        this.side6.display();
        this.popMatrix();

        this.popMatrix();
    }
}