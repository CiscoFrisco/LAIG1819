class Cube extends CGFobject {
    constructor(scene, scaleX = 1, scaleY = 1, scaleZ = 1){
        super(scene);

        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;

        this.side = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
    }

    display(){

        this.scene.pushMatrix();

        this.scene.scale(this.scaleX, this.scaleY, this.scaleZ);
        this.scene.translate(0,0,-0.5);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,1);
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0.5);
        this.scene.rotate(Math.PI/2, 1,0,0);
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0.5);
        this.scene.rotate(-Math.PI/2, 1,0,0);
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5,0,0.5);
        this.scene.rotate(Math.PI/2, 0,1,0);
        this.side.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,0.5);
        this.scene.rotate(-Math.PI/2, 0,1,0);
        this.side.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}