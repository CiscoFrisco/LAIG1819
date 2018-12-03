class Board extends CGFobject {
    constructor(scene, boardMat, piece1Mat, piece2Mat) {
        super(scene);

        this.initAppearances(boardMat, piece1Mat, piece2Mat);
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

    initAppearances(boardMat, piece1Mat, piece2Mat) {
        this.whiteAppearance = piece2Mat;
        this.blackAppearance = piece1Mat;
        this.boardAppearance = boardMat;

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