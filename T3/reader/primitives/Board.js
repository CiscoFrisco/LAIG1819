class Board extends CGFobject {
    constructor(scene) {
        super(scene);

        this.initAppearances();
        this.initPieces();
        this.initDivisions();
    }

    initDivisions() {
        this.divisions = [];

        let x = -2,
            z = -2;

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.divisions.push({
                    obj: new Cube(this.scene, 1, 0.5, 1),
                    x: x,
                    z: z
                });
                x += 1;
            }
            x = -2;
            z += 1;
        }
    }

    initPieces() {

        this.whitePieces = [];
        this.blackPieces = [];

        let whitePiece1 = {
            obj: new Piece(this.scene, this.whiteAppearance),
            x: -1,
            y: 0.4,
            z: 2
        }

        this.whitePieces.push(whitePiece1);

        let whitePiece2 = {
            obj: new Piece(this.scene, this.whiteAppearance),
            x: 1,
            y: 0.4,
            z: 2
        }

        this.whitePieces.push(whitePiece2);

        let whitePiece3 = {
            obj: new Piece(this.scene, this.whiteAppearance),
            x: 0,
            y: 0.4,
            z: -1
        }

        this.whitePieces.push(whitePiece3);

        let blackPiece1 = {
            obj: new Piece(this.scene, this.blackAppearance),
            x: -1,
            y: 0.4,
            z: -2
        }

        this.blackPieces.push(blackPiece1);

        let blackPiece2 = {
            obj: new Piece(this.scene, this.blackAppearance),
            x: 1,
            y: 0.4,
            z: -2
        }

        this.blackPieces.push(blackPiece2);

        let blackPiece3 = {
            obj: new Piece(this.scene, this.blackAppearance),
            x: 0,
            y: 0.4,
            z: 1
        }

        this.blackPieces.push(blackPiece3);
    }

    initAppearances() {
        this.whiteAppearance = new CGFappearance(this.scene);
        this.whiteAppearance.setShininess(10);
        this.whiteAppearance.setEmission(0.8, 0.8, 0.8, 1.0);
        this.whiteAppearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
        this.whiteAppearance.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.whiteAppearance.setAmbient(0.7, 0.7, 0.7, 1.0);

        this.blackAppearance = new CGFappearance(this.scene);
        this.blackAppearance.setShininess(10);
        this.blackAppearance.setEmission(0.0, 0.0, 0.0, 1.0);
        this.blackAppearance.setDiffuse(0.2, 0.2, 0.2, 1.0);
        this.blackAppearance.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.blackAppearance.setAmbient(0.1, 0.1, 0.1, 1.0);

        this.boardAppearance = new CGFappearance(this.scene);
        this.boardAppearance.setShininess(10);
        this.boardAppearance.setEmission(0.8, 0.3, 0.3, 1.0);
        this.boardAppearance.setDiffuse(0.8, 0.3, 0.3, 1.0);
        this.boardAppearance.setSpecular(0.8, 0.3, 0.3, 1.0);
        this.boardAppearance.setAmbient(0.8, 0.3, 0.3, 1.0);

        this.boardTexture = new CGFtexture(this.scene, "scenes/images/piece.png");
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(0.3,0.3,0.3);
        this.boardTexture.bind();

        for (let i = 0; i < this.divisions.length; i++) {
            let division = this.divisions[i];
            this.scene.pushMatrix();
            this.scene.translate(division.x, 0, division.z);
            division.obj.display();
            this.scene.popMatrix();
        }

        this.boardTexture.unbind();

        for (let i = 0; i < this.whitePieces.length; i++) {
            let piece = this.whitePieces[i];
            this.scene.pushMatrix();
            this.scene.translate(piece.x, piece.y, piece.z);
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            piece.obj.display();
            this.scene.popMatrix();
        }

        for (let i = 0; i < this.blackPieces.length; i++) {
            let piece = this.blackPieces[i];
            this.scene.pushMatrix();
            this.scene.translate(piece.x, piece.y, piece.z);
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            piece.obj.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}