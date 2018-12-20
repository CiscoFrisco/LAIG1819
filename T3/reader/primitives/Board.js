class Board extends CGFobject {
  constructor(scene, boardMat, piece1Mat, piece2Mat) {
    super(scene);

    this.initAppearances(boardMat, piece1Mat, piece2Mat);
    this.initPieces();
    this.initDivisions();

    this.pickStates = Object.freeze({
      NO_PICK: 1,
      PICK_PIECE: 2,
      PICK_MOVE: 3,
      CHECK_GAME_OVER: 4
    });
    this.pickState = this.pickStates.NO_PICK;
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
      let row = [];
      for (let j = 0; j < 5; j++) {
        row.push({
          obj: new Cube(this.scene, 1, 0.5, 1),
          x: x,
          z: z,
          high: false
        });
        x += 1;
      }

      this.divisions.push(row);
      x = -2;
      z += 1;
    }
  }

  initPieces() {
    this.whitePieces = [];
    this.blackPieces = [];

    let blackPiece1 = {
      obj: new Piece(this.scene, this.blackAppearance),
      x: -1,
      y: 0.4,
      z: 2
    };

    let blackPiece2 = {
      obj: new Piece(this.scene, this.blackAppearance),
      x: 1,
      y: 0.4,
      z: 2
    };

    let blackPiece3 = {
      obj: new Piece(this.scene, this.blackAppearance),
      x: 0,
      y: 0.4,
      z: -1
    };

    let whitePiece1 = {
      obj: new Piece(this.scene, this.whiteAppearance),
      x: -1,
      y: 0.4,
      z: -2
    };

    let whitePiece2 = {
      obj: new Piece(this.scene, this.whiteAppearance),
      x: 1,
      y: 0.4,
      z: -2
    };

    let whitePiece3 = {
      obj: new Piece(this.scene, this.whiteAppearance),
      x: 0,
      y: 0.4,
      z: 1
    };

    this.whitePieces.push(whitePiece1, whitePiece2, whitePiece3);
    this.blackPieces.push(blackPiece1, blackPiece2, blackPiece3);
  }

  initAppearances(boardMat, piece1Mat, piece2Mat) {
    this.whiteAppearance = piece2Mat;
    this.blackAppearance = piece1Mat;
    this.boardAppearance = boardMat;

    this.boardTexture = new CGFtexture(this.scene, 'scenes/images/piece.png');
    this.boardTextureHigh =
      new CGFtexture(this.scene, 'scenes/images/piece_high.png');
  }

  displayBoardBase() {
    for (let i = 0; i < this.divisions.length; i++) {
      for (let j = 0; j < this.divisions.length; j++) {
        let division = this.divisions[i][j];
        this.scene.pushMatrix();
        this.scene.translate(division.x, 0, division.z);

        if (this.pickState === this.pickStates.PICK_MOVE && division.high) {
          this.scene.registerForPick(i * 5 + j + 1, division);
        } else
          this.scene.registerForPick(0, null);


        let texture = division.high ? this.boardTextureHigh : this.boardTexture;

        texture.bind();

        division.obj.display();

        texture.unbind();

        this.scene.popMatrix();
      }
    }

    this.scene.registerForPick(0, null);
  }

  check_event(event) {
    switch (this.pickState) {
      case this.pickStates.PICK_PIECE:
        break;
      case this.pickStates.PICK_MOVE:
        break;
      default:
        break;
    }
  }

  // PICK_MOVE -> NO_PICK ;; PICK_PIECE -> PICK_MOVE ;; NO_PICK -> PICK_PIECE
  nextState() {
    if (this.scene.game.gameState > 2) {
      if (this.pickState === this.pickStates.PICK_MOVE &&
        this.scene.game.move_ready) {
        if (!this.anim.isActive) this.createAnim();
        this.scene.game.move_ready = false;
        this.highlightPieces(JSON.parse(this.scene.game.valid_moves), false);
        this.pickState = this.pickStates.CHECK_GAME_OVER;
      } else if (this.pickState === this.pickStates.NO_PICK) {
        ++this.pickState;
      } else if (
        this.pickState === this.pickStates.PICK_PIECE &&
        this.scene.game.moves_ready) {
        ++this.pickState;
        this.scene.game.moves_ready = false;
        console.log('yoooooooo');
        this.highlightPieces(JSON.parse(this.scene.game.valid_moves));
      }
      else if(this.pickState === this.pickStates.CHECK_GAME_OVER){

        if(this.scene.game.winner_ready){
          let winner = this.scene.game.winner;
          this.sent = false;

          if(winner != 0){
            this.scene.game.gameState = this.scene.game.gameStates.MENU;
          }
          else{
            this.pickState = this.pickStates.PICK_PIECE;
          }

          this.scene.game.winner_ready = false;
        }
        else if(!this.sent){
          this.scene.game.gameOver();
          this.sent = true;
        }
      }
    }
  }

  getPieceCoordinates(piece) {
    for (let i = 0; i < this.divisions.length; i++) {
      for (let j = 0; j < this.divisions.length; j++) {
        let division = this.divisions[i][j];
        if (division.x === piece.x && division.z === piece.z)
          return [i + 1, j + 1];
      }
    }
  }

  save(obj, id) {
    if (this.pickState === this.pickStates.PICK_PIECE) {
      this.selectedPiece = {
        x: obj.x,
        y: obj.y,
        z: obj.z,
        id: id
      };

      this.scene.game.getValidMoves(
        this.getPieceCoordinates(this.selectedPiece));
    } else {
      this.selectedMove = {
        x: obj.x,
        z: obj.z,
        id: id
      };

      let move = this.getPieceCoordinates(this.selectedPiece);
      move.push(this.getPieceCoordinates(this.selectedMove));
      console.log(move);

      this.scene.game.move(move);
    }
  }

  highlightPieces(validMoves, high = true) {
    for (let i = 0; i < validMoves.length; i++) {
      let piece = validMoves[i].slice(2, 4);

      this.divisions[piece[0] - 1][piece[1] - 1].high = high;
    }
  }

  createAnim() {
    var path = [
      [0, 0, 0],
      [
        this.selectedMove.x - this.selectedPiece.x, 0,
        this.selectedMove.z - this.selectedPiece.z
      ]
    ];

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
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
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
            console.log('Picked object: ' + obj + ', with pick id ' + customId);
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
      if (this.pickState === this.pickStates.PICK_PIECE &&
        this.currPlayer === player)
        this.scene.registerForPick(i + 1, piece);

      if (this.anim.isActive && this.anim.id === i + 1 &&
        this.currPlayer === player) {
        this.anim.anim.apply();
      }

      piece.obj.display();
      this.scene.popMatrix();
    }

    this.scene.registerForPick(0, null);
  }

  display() {
    if (this.scene.game.gameState > 2) this.logPicking();

    this.scene.pushMatrix();
    this.scene.scale(0.3, 0.3, 0.3);

    this.displayBoardBase();

    this.displayPieces(this.whitePieces, 2);
    this.displayPieces(this.blackPieces, 1);

    this.checkAnim();
    this.scene.popMatrix();
  }

  update(deltaTime) {
    this.nextState();
    if (this.anim.isActive) {
      this.anim.anim.update(deltaTime);
    }
  }
}