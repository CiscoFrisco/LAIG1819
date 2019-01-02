class Board extends CGFobject {
  constructor(scene, boardMat, piece1Mat, piece2Mat, boardTex, highTex) {
    super(scene);

    this.initAppearances(boardMat, piece1Mat, piece2Mat, boardTex, highTex);

    this.pickStates = Object.freeze({
      NO_PICK: 1,
      PICK_PIECE: 2,
      PICK_PLAYER_MOVE: 3,
      PICK_MOVE: 4,
      CHECK_GAME_OVER: 5
    });
    this.selectedPiece = null;
    this.selectedMove = null;
    this.anim = {
      id: 0,
      isActive: false
    };
    this.boardLength = 5;
    this.numPieces = this.boardLength * this.boardLength;
    this.animDuration = 2;

    this.init();
  }

  init() {
    this.initPieces();
    this.initDivisions();
    this.currPlayer = 1;
    this.pickState = this.pickStates.NO_PICK;
    this.scene.game.resetTimer(false);
  }

  reset() {
    this.resetPieces();
    this.resetDivisions();
    this.currPlayer = 1;
    this.pickState = this.pickStates.NO_PICK;
    this.scene.game.resetTimer(false);
  }

  initDivisions() {
    this.divisions = [];

    let x = -2,
      z = -2;

    for (let i = 0; i < this.boardLength; i++) {
      let row = [];
      for (let j = 0; j < this.boardLength; j++) {
        row.push({
          obj: new Cube(this.scene, 1, 0.5, 1),
          x: x,
          z: z,
          high: false,
          id: i * 5 + j + 1
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
      y: 0.25,
      z: 2,
      id: 26
    };

    let blackPiece2 = {
      obj: new Piece(this.scene, this.blackAppearance),
      x: 1,
      y: 0.25,
      z: 2,
      id: 27
    };

    let blackPiece3 = {
      obj: new Piece(this.scene, this.blackAppearance),
      x: 0,
      y: 0.25,
      z: -1,
      id: 28
    };

    let whitePiece1 = {
      obj: new Piece(this.scene, this.whiteAppearance),
      x: -1,
      y: 0.25,
      z: -2,
      id: 26
    };

    let whitePiece2 = {
      obj: new Piece(this.scene, this.whiteAppearance),
      x: 1,
      y: 0.25,
      z: -2,
      id: 27
    };

    let whitePiece3 = {
      obj: new Piece(this.scene, this.whiteAppearance),
      x: 0,
      y: 0.25,
      z: 1,
      id: 28
    };

    this.whitePieces.push(whitePiece1, whitePiece2, whitePiece3);
    this.blackPieces.push(blackPiece1, blackPiece2, blackPiece3);
  }

  resetDivisions() {
    let x = -2,
      z = -2;

    for (let i = 0; i < this.boardLength; i++) {
      let row = this.divisions[i];
      for (let j = 0; j < this.boardLength; j++) {

        row[j].x = x;
        row[j].z = z;
        row[j].high = false;

        x += 1;
      }

      this.divisions[i] = row;
      x = -2;
      z += 1;
    }
  }

  resetPieces() {

    let blackPiece1 = this.blackPieces[0];
    blackPiece1.x = -1;
    blackPiece1.y = 0.25;
    blackPiece1.z = 2;

    let blackPiece2 = this.blackPieces[1];
    blackPiece2.x = 1;
    blackPiece2.y = 0.25;
    blackPiece2.z = 2;

    let blackPiece3 = this.blackPieces[2];
    blackPiece3.x = 0;
    blackPiece3.y = 0.25;
    blackPiece3.z = -1;

    let whitePiece1 = this.whitePieces[0];
    whitePiece1.x = -1;
    whitePiece1.y = 0.25;
    whitePiece1.z = -2;

    let whitePiece2 = this.whitePieces[1];
    whitePiece2.x = 1;
    whitePiece2.y = 0.25;
    whitePiece2.z = -2;

    let whitePiece3 = this.whitePieces[2];
    whitePiece3.x = 0;
    whitePiece3.y = 0.25;
    whitePiece3.z = 1;
  }

  initAppearances(boardMat, piece1Mat, piece2Mat, boardTex, highTex) {
    this.whiteAppearance = piece2Mat;
    this.blackAppearance = piece1Mat;
    this.boardAppearance = boardMat;

    this.boardTexture = boardTex;
    this.boardTextureHigh = highTex;
  }

  displayBoardBase() {
    for (let i = 0; i < this.divisions.length; i++) {
      for (let j = 0; j < this.divisions.length; j++) {
        let division = this.divisions[i][j];
        this.scene.pushMatrix();
        this.scene.translate(division.x, 0, division.z);

        if (this.pickState === this.pickStates.PICK_PLAYER_MOVE && division.high) {
          this.scene.registerForPick(division.id, division);
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

  getPieceCoordinates(piece) {
    for (let i = 0; i < this.divisions.length; i++) {
      for (let j = 0; j < this.divisions.length; j++) {
        let division = this.divisions[i][j];
        if (division.x === piece.x && division.z === piece.z)
          return [i + 1, j + 1];
      }
    }
  }

  save(obj) {
    if (obj.id > this.numPieces) {
      this.selectedPiece = obj;

      if (this.pickState === this.pickStates.PICK_PLAYER_MOVE)
        this.highlightPieces(JSON.parse(this.scene.game.valid_moves), false);

      this.scene.game.getValidMoves(
        this.getPieceCoordinates(this.selectedPiece));

    } else {
      this.selectedMove = obj;

      let move = this.getPieceCoordinates(this.selectedPiece);
      move.push(this.getPieceCoordinates(this.selectedMove));

      this.scene.game.move(move);
    }
  }

  getPiece(move) {
    let division = this.divisions[move[0]][move[1]];

    for (let i = 0; i < this.blackPieces.length; i++) {
      if (this.blackPieces[i].x === division.x &&
        this.blackPieces[i].z === division.z)
        return this.blackPieces[i];
      else if (
        this.whitePieces[i].x === division.x &&
        this.whitePieces[i].z === division.z)
        return this.whitePieces[i];
    }
  }

  getDivision(move) {
    return this.divisions[move[2]][move[3]];
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

    this.anim.anim = new ArcAnimation(this.scene, this.animDuration, path);
    this.anim.id = this.selectedPiece.id;
    this.anim.isActive = true;
  }

  checkAnim() {
    if (this.anim.isActive && this.anim.anim.isOver()) {
      switch (this.currPlayer) {
        case 1:
          this.blackPieces[this.anim.id - 1 - this.numPieces].x = this.selectedMove.x;
          this.blackPieces[this.anim.id - 1 - this.numPieces].y = this.selectedPiece.y;
          this.blackPieces[this.anim.id - 1 - this.numPieces].z = this.selectedMove.z;
          break;
        case 2:
          this.whitePieces[this.anim.id - 1 - this.numPieces].x = this.selectedMove.x;
          this.whitePieces[this.anim.id - 1 - this.numPieces].y = this.selectedPiece.y;
          this.whitePieces[this.anim.id - 1 - this.numPieces].z = this.selectedMove.z;
          break;
        default:
          break;
      }

      this.selectedPiece = null;
      this.selectedMove = null;
      this.anim.isActive = false;
      if (this.movie_ready) {
        this.scene.game.currAnim++;
        this.scene.game.currAnimOver = true;
      } else {
        this.pickState = this.pickStates.CHECK_GAME_OVER;
        this.last_to_play = this.currPlayer;
      }
      this.sent = false;
    }
  }

  logPicking() {

    let picked = false;

    if (this.scene.pickMode == false) {
      if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
        for (var i = 0; i < this.scene.pickResults.length; i++) {
          var obj = this.scene.pickResults[i][0];
          if (obj) {
            var customId = this.scene.pickResults[i][1];

            if (customId >= 1 && customId <= 28) {
              picked = true;
              this.save(obj, customId);
            }
            console.log('Picked object: ' + obj + ', with pick id ' + customId);
          }
        }
        if (picked)
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
      if ((this.pickState === this.pickStates.PICK_PIECE || this.pickState === this.pickStates.PICK_PLAYER_MOVE) &&
        this.currPlayer === player)
        this.scene.registerForPick(piece.id, piece);

      if (this.anim.isActive && this.anim.id === piece.id &&
        this.currPlayer === player) {
        this.anim.anim.apply();
      }

      piece.obj.display();
      this.scene.popMatrix();
    }

    this.scene.registerForPick(0, null);
  }

  display() {

    if (this.scene.game.gameState === this.scene.game.gameStates.PVP || this.scene.game.gameState === this.scene.game.gameStates.PVC)
      this.logPicking();

    this.scene.pushMatrix();
    this.scene.scale(0.3, 0.3, 0.3);

    this.displayBoardBase();

    this.displayPieces(this.whitePieces, 2);
    this.displayPieces(this.blackPieces, 1);

    this.checkAnim();
    this.scene.popMatrix();
  }

  updateCVC() {

    if (this.scene.game.setup_anim) {
      this.resetPieces();
      this.currPlayer = this.scene.game.first_to_play;
      this.scene.game.setup_anim = false;
      this.movie_ready = true;
    } else if (this.movie_ready) {
      if (this.scene.game.currAnim == this.scene.game.movie_moves.length) {
        this.movie_ready = false;
        // this.currPlayer = this.currPlayer == 1 ? 2 : 1;
        // this.scene.game.currPlayer = this.currPlayer;
      }
      else if (this.scene.game.currAnimOver) {
        this.currPlayer = this.scene.game.players[this.scene.game.currAnim];
        this.selectedPiece = this.getPiece(this.scene.game.movie_moves[this.scene.game.currAnim]);
        this.selectedMove = this.getDivision(this.scene.game.movie_moves[this.scene.game.currAnim]);
        this.createAnim();
        this.scene.game.currAnimOver = false;
      }
    } else {
      switch (this.pickState) {
        case this.pickStates.PICK_MOVE:
          if (!this.sent) {
            this.scene.game.choose_move();
            this.sent = true;
          } else if (this.scene.game.bot_ready) {
            let move = this.scene.game.bot_move;
            this.selectedPiece = this.getPiece(move);
            this.selectedMove = this.getDivision(move);
            this.createAnim();
            this.scene.game.stopTimer();
            this.scene.game.bot_ready = false;
          }
          break;
        case this.pickStates.CHECK_GAME_OVER:
          if (!this.sent) {
            this.scene.game.gameOver();
            this.sent = true;
          } else if (this.scene.game.winner_ready) {
            let winner = this.scene.game.winner;
            this.sent = false;

            if (winner != 0) {
              this.scene.game.initData();
              this.reset();
              this.scene.updateCamera(0);
            } else {
              this.scene.game.resetTimer();
              this.pickState = this.pickStates.PICK_MOVE;
              this.currPlayer = 3 - this.currPlayer;
            }

            this.scene.game.winner_ready = false;
          }
          break;
        default:
          this.pickState = this.pickStates.PICK_MOVE;
          this.scene.game.timer = true;
          break;
      }
    }
  }

  updatePVP() {

    if (this.scene.game.setup_anim) {
      this.resetPieces();
      this.currPlayer = this.scene.game.first_to_play;
      this.scene.game.setup_anim = false;
      this.movie_ready = true;
    } else if (this.movie_ready) {
      if (this.scene.game.currAnim == this.scene.game.movie_moves.length) {
        this.movie_ready = false;
        this.currPlayer = this.currPlayer == 1 ? 2 : 1;
        this.scene.game.currPlayer = this.currPlayer;
      }
      else if (this.scene.game.currAnimOver) {
        this.currPlayer = this.scene.game.players[this.scene.game.currAnim];
        this.selectedPiece = this.getPiece(this.scene.game.movie_moves[this.scene.game.currAnim]);
        this.selectedMove = this.getDivision(this.scene.game.movie_moves[this.scene.game.currAnim]);
        this.createAnim();
        this.scene.game.currAnimOver = false;
      }
    } else if (this.scene.game.undo_ready) {
      this.undo_move = true;
      this.currPlayer = this.scene.game.undo_player;
      this.pickState = this.pickStates.PICK_PIECE;
      this.selectedPiece = this.getPiece(this.scene.game.undo_move);
      this.selectedMove = this.getDivision(this.scene.game.undo_move);
      this.createAnim();
      this.scene.game.currPlayer = this.currPlayer;
      this.scene.game.undo_ready = false;

    } else {
      if (this.pickState === this.pickStates.PICK_PLAYER_MOVE) {

        if (this.scene.game.moves_ready) {
          this.scene.game.moves_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves));
        }

        if (this.scene.game.move_ready) {
          if (!this.anim.isActive) {
            this.scene.game.stopTimer();
            this.createAnim();
          }
          this.scene.game.move_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves), false);
        }

        if (this.scene.game.turnOver) {
          this.scene.game.nextPlayer();
          this.currPlayer = 3 - this.currPlayer;
          this.pickState = this.pickStates.PICK_PIECE;
          this.scene.game.turnOver = false;
          this.scene.game.move_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves), false);
        }

      } else if (
        this.pickState === this.pickStates.PICK_PIECE) {

        if (this.scene.game.moves_ready) {
          this.pickState = this.pickStates.PICK_PLAYER_MOVE;
          this.scene.game.moves_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves));
        }

        if (this.scene.game.turnOver) {
          this.scene.game.nextPlayer();
          this.currPlayer = 3 - this.currPlayer;
          this.scene.game.turnOver = false;
        }

      } else if (this.pickState === this.pickStates.CHECK_GAME_OVER) {
        if (this.scene.game.winner_ready) {
          let winner = this.scene.game.winner;
          this.sent = false;
          if (winner != 0) {
            this.scene.game.initData();
            this.reset();
            this.scene.updateCamera(0);
          } else {
            if (!this.undo_move) {
              this.currPlayer = 3 - this.currPlayer;
            }
            this.pickState = this.pickStates.PICK_PIECE;
            this.scene.game.resetTimer();
            this.undo_move = false;
          }

          this.scene.game.winner_ready = false;
        } else if (!this.sent) {
          this.scene.game.gameOver();
          this.sent = true;
        }
      } else {
        this.pickState = this.pickStates.PICK_PIECE;
        this.scene.game.timer = true;
      }
    }
  }

  updatePVC() {

    if (this.scene.game.setup_anim) {
      this.resetPieces();
      this.currPlayer = this.scene.game.first_to_play;
      this.scene.game.setup_anim = false;
      this.movie_ready = true;
    } else if (this.movie_ready) {
      if (this.scene.game.currAnim == this.scene.game.movie_moves.length) {
        this.movie_ready = false;
        this.currPlayer = this.currPlayer == 1 ? 2 : 1;
        this.scene.game.currPlayer = this.currPlayer;
      }
      else if (this.scene.game.currAnimOver) {
        this.currPlayer = this.scene.game.players[this.scene.game.currAnim];
        this.selectedPiece = this.getPiece(this.scene.game.movie_moves[this.scene.game.currAnim]);
        this.selectedMove = this.getDivision(this.scene.game.movie_moves[this.scene.game.currAnim]);
        this.createAnim();
        this.scene.game.currAnimOver = false;
      }
    } else if (this.scene.game.undo_ready) {
      this.undo_move = true;
      this.currPlayer = this.scene.game.undo_player;
      this.pickState = this.pickStates.PICK_PIECE;
      this.selectedPiece = this.getPiece(this.scene.game.undo_move);
      this.selectedMove = this.getDivision(this.scene.game.undo_move);
      this.createAnim();
      this.scene.game.currPlayer = this.currPlayer;
      this.scene.game.undo_ready = false;
    } else {
      if (this.pickState === this.pickStates.PICK_PLAYER_MOVE) {

        if (this.scene.game.moves_ready) {
          this.pickState = this.pickStates.PICK_PLAYER_MOVE;
          this.scene.game.moves_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves));
        }

        if (this.scene.game.move_ready) {
          if (!this.anim.isActive) {
            this.scene.game.stopTimer();
            this.createAnim();
          }
          this.scene.game.move_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves), false);
        }


        if (this.scene.game.turnOver) {

          this.currPlayer = 2;
          this.scene.game.currPlayer = 2;
          this.pickState = this.pickStates.PICK_MOVE;
          this.scene.game.move_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves), false);
          this.scene.game.turnOver = false;
        }

      } else if (this.pickState === this.pickStates.PICK_MOVE) {
        if (!this.sent) {
          this.scene.game.choose_move();
          this.sent = true;
        } else if (this.scene.game.bot_ready) {
          let move = this.scene.game.bot_move;
          this.selectedPiece = this.getPiece(move);
          this.selectedMove = this.getDivision(move);

          this.createAnim();
          this.scene.game.stopTimer();
          this.scene.game.bot_ready = false;
        }


        if (this.scene.game.turnOver) {

          this.currPlayer = 1;
          this.scene.game.currPlayer = 1;
          this.pickState = this.pickStates.PICK_PLAYER_MOVE;

          this.scene.game.turnOver = false;
        }

      } else if (
        this.pickState === this.pickStates.PICK_PIECE) {

        if (this.scene.game.moves_ready) {
          this.pickState = this.pickStates.PICK_PLAYER_MOVE;
          this.scene.game.moves_ready = false;
          this.highlightPieces(JSON.parse(this.scene.game.valid_moves));
        }

        if (this.scene.game.turnOver) {

          this.currPlayer = 2;
          this.scene.game.currPlayer = 2;
          this.scene.game.turnOver = false;
          this.pickState = this.pickStates.PICK_MOVE;
        }

      } else if (this.pickState === this.pickStates.CHECK_GAME_OVER) {
        if (this.scene.game.winner_ready) {
          let winner = this.scene.game.winner;
          this.sent = false;

          if (winner != 0) {
            this.scene.game.initData();
            this.reset();
            this.scene.updateCamera(0);
          } else {
            if (!this.undo_move) {
              this.currPlayer = 3 - this.currPlayer;
            }

            this.scene.game.resetTimer();
            this.pickState = this.currPlayer === 1 ? this.pickStates.PICK_PIECE : this.pickStates.PICK_MOVE;
            this.undo_move = false;
          }

          this.scene.game.winner_ready = false;
        } else if (!this.sent) {
          this.scene.game.gameOver();
          this.sent = true;
        }
      } else {
        this.pickState = this.pickStates.PICK_PIECE;
        this.scene.game.timer = true;
      }
    }
  }

  update(deltaTime) {

    switch (this.scene.game.gameState) {
      case this.scene.game.gameStates.PVP:
        this.updatePVP();
        break;
      case this.scene.game.gameStates.PVC:
        this.updatePVC();
        break;
      case this.scene.game.gameStates.CVC:
        this.updateCVC();
        break;
      default:
        break;
    }

    if (this.anim.isActive) {
      this.anim.anim.update(deltaTime);
    }
  }
}