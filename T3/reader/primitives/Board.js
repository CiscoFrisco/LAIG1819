class Board extends CGFobject {
    constructor(scene, boardMat, piece1Mat, piece2Mat) {
        super(scene);

        this.initAppearances(boardMat, piece1Mat, piece2Mat);
        this.initPieces();
        this.initDivisions();

        this.pickStates = Object.freeze({
            "noPick": 1,
            "pickPiece": 2,
            "pickMove": 3
        });
        this.pickState = this.pickStates.pickPiece;
        this.currPlayer = 1;
        this.selectedPiece = null;
        this.selectedMove = null;
        this.anim = {
            id: 0,
            isActive: false
        };
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

    displayBoardBase() {
        this.boardTexture.bind();

        for (let i = 0; i < this.divisions.length; i++) {
            let division = this.divisions[i];
            this.scene.pushMatrix();
            this.scene.translate(division.x, 0, division.z);

            if (this.pickState === this.pickStates.pickMove) {
                this.scene.registerForPick(i + 1, division);
            }

            division.obj.display();
            this.scene.popMatrix();
        }

        this.boardTexture.unbind();
        this.scene.registerForPick(0, null);
    }


    // pickMove -> noPick ;; pickPiece -> pickMove ;; noPick -> pickPiece
    nextState() {
        if (this.scene.gameState > 2) {
            if (this.pickState === this.pickStates.pickMove) {
                this.createAnim();
                // this.currPlayer = this.currPlayer === 1 ? 2 : 1;
                this.pickState = this.pickStates.pickPiece;
            }
            else
                ++this.pickState;
        }
    }

    save(obj, id) {
        if (this.pickState === this.pickStates.pickPiece) {
            this.selectedPiece = {
                x: obj.x,
                y: obj.y,
                z: obj.z,
                id: id
            }
        }
        else {
            this.selectedMove = {
                x: obj.x,
                z: obj.z,
                id: id
            }
        }
    }

    createAnim() {

        var path = [
            [0, 0, 0],
            [this.selectedMove.x - this.selectedPiece.x, 0, this.selectedMove.z - this.selectedPiece.z]
        ]

        this.anim.anim = new LinearAnimation(this.scene, 2, path);
        this.anim.id = this.selectedPiece.id;
        this.anim.isActive = true;
    }

    checkAnim() {
        if (this.anim.isActive && this.anim.anim.isOver()) {
            switch (this.currPlayer) {
                case 1:
                    this.blackPieces[this.anim.id - 1].x = this.selectedMove.x;
                    this.blackPieces[this.anim.id - 1].y = this.selectedPiece.y;
                    this.blackPieces[this.anim.id - 1].z = this.selectedMove.z;
                    break;
                case 2:
                    this.whitePieces[this.anim.id - 1].x = this.selectedMove.x;
                    this.whitePieces[this.anim.id - 1].y = this.selectedPiece.y;
                    this.whitePieces[this.anim.id - 1].z = this.selectedMove.z;
                    break;
                default:
                    break;
            }

            this.selectedPiece = null;
            this.selectedMove = null;

            this.anim.isActive = false;
        }
    }

    logPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];
                    if (obj) {
                        var customId = this.scene.pickResults[i][1];
                        this.save(obj, customId);
                        this.nextState();
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    displayPieces(pieces, player) {
        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            this.scene.pushMatrix();
            this.scene.translate(piece.x, piece.y, piece.z);

            // and if these pieces belong to the current player
            if (this.pickState === this.pickStates.pickPiece && this.currPlayer === player)
                this.scene.registerForPick(i + 1, piece);


            if (this.anim.isActive && this.anim.id === i + 1 && this.currPlayer === player) {
                this.anim.anim.apply();
            }

            piece.obj.display();
            this.scene.popMatrix();
        }

        this.scene.registerForPick(0, null);
    }

    display() {
        if (this.scene.gameState > 2)
            this.logPicking();

        this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 0.3);

        this.displayBoardBase();

        this.displayPieces(this.whitePieces, 2);
        this.displayPieces(this.blackPieces, 1);

        this.checkAnim();
        this.scene.popMatrix();
    }

    update(deltaTime) {
        if (this.anim.isActive) {
            this.anim.anim.update(deltaTime);
        }
    }
}