class Board extends CGFobject {
    constructor(scene){
        super(scene);

        this.initAppearances();
        this.initPieces();
        this.initDivisions();
    }

    initDivisions(){
        this.divisions = [];

        for(let i = 0; i < 25; i++){
            this.divisions.push(new Cube(this.scene, 10, 5, 10));
        }
    }

    initPieces(){

        this.whitePieces = [];
        this.blackPieces = [];

        for(let i = 0; i < 3; i++){
            this.whitePieces.push({object: new Piece(this.scene, this.whiteAppearance)});
            this.blackPieces.push(new Piece(this.scene, this.blackAppearance));
        }
    }

    initAppearances(){
        this.whiteApperance = new CGFappearance();
        this.whiteAppearance.setShininess(10);
        this.whiteAppearance.setEmission(0.8,0.8,0.8,1.0);
        this.whiteAppearance.setDiffuse(0.8,0.8,0.8,1.0);
        this.whiteAppearance.setSpecular(1.0,1.0,1.0,1.0);
        this.whiteAppearance.setAmbient(0.7,0.7,0.7,1.0);

        this.blackApperance = new CGFappearance();
        this.blackApperance.setShininess(10);
        this.blackApperance.setEmission(0.0,0.0,0.0,1.0);
        this.blackApperance.setDiffuse(0.2,0.2,0.2,1.0);
        this.blackApperance.setSpecular(0.2,0.2,0.2,1.0);
        this.blackApperance.setAmbient(0.1,0.1,0.1,1.0);

        this.boardApperance = new CGFappearance();
        this.boardApperance.setShininess(10);
        this.boardApperance.setEmission(0.8,0.5,0.5,1.0);
        this.boardApperance.setDiffuse(0.8,0.5,0.5,1.0);
        this.boardApperance.setSpecular(0.8,0.5,0.5,1.0);
        this.boardApperance.setAmbient(0.8,0.5,0.5,1.0);

        this.boardTexture = new CGFtexture("scenes/images/piece.png");
    }

    display(){
        this.pushMatrix();
        
        this.boardTexture.bind();

        let x=-25, z = -25;

        for(let i = 0; i < 5; i++)
        {
            for(let j = 0; j < 5; j++){
                this.pushMatrix();
                this.scene.translate(x,0,z);
                this.divisions[i].display();
                this.popMatrix();

                x+=10;
            }
            x=0;
            z+=10;
        }

        this.boardTexture.unbind();

        for(let i = 0; i < this.whitePieces.length; i++)
        {
            this.whitePieces[i].display();
        }

        for(let i = 0; i < this.blackPieces.length; i++)
        {
            this.blackPieces[i].display();
        }

        this.popMatrix();
    }   
}