class Game {
    constructor(scene) {

        this.server = new Server();
        this.scene = scene;

        this.gameStates = Object.freeze({
            "MENU": 1,
            "DIFFICULTY": 2,
            "PVP": 3,
            "PVC": 4,
            "CVC": 5
        });

        this.difficulties = Object.freeze({
            "EASY": 2,
            "MEDIUM": 3,
            "HARD": 4,
        });

        this.maxTime = 10;

        this.initData();
    }


    initData() {
        this.board = [
            ['empty', 'white', 'empty', 'white', 'empty'],
            ['empty', 'empty', 'black', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'white', 'empty', 'empty'],
            ['empty', 'black', 'empty', 'black', 'empty']
        ];
        this.currPlayer = 1;
        this.countOcurrences = [];
        this.boards = [this.board];
        this.gameState = this.gameStates.MENU;
        this.difficulty = this.difficulties.MEDIUM;
        this.score = 0;

        this.time = this.maxTime;
        this.timer = false;
        this.elapsedTime = this.maxTime * 1000;
    }

    getPieces(player) {

        let piece = "";

        switch (player) {
            case 1:
                piece = "black";
                break;
            case 2:
                piece = "white";
                break;
            default:
                break;
        }

        let pieces = [];

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] === piece) {
                    pieces.push([i, j]);
                }
            }
        }

        return pieces;
    }

    nextPlayer() {
        this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }

    parseArrayToString(array) {

        let string = "["

        for (let i = 0; i < array.length; i++) {
            if (i > 0)
                string += ",";
            string += array[i];
        }

        string += "]";

        return string;
    }

    getBoardString() {

        console.log(this.board);

        let board_string = '';

        for (let i = 0; i < this.board.length; i++) {
            if (i > 0)
                board_string += ',';
            board_string += '[';
            for (let j = 0; j < this.board.length; j++) {
                if (j > 0)
                    board_string += ',';
                board_string += this.board[i][j];
            }
            board_string += ']';
        }

        return board_string;
    }

    getValidMoves(piece) {

        let piece_string = this.parseArrayToString(piece);
        let board_string = this.getBoardString();
        let this_game = this;

        this.server.getPrologRequest("valid_moves([" + board_string + "]," + piece_string + ")", function (data) {
            this_game.valid_moves = data.target.response;
            this_game.moves_ready = true;
        });
    }


    move(move) {
        let this_game = this;
        let board_string = this.getBoardString();

        this.server.getPrologRequest("move([" + move + "]," + this.currPlayer + ",[" + board_string + "])", function (data) {
            let newBoard = JSON.parse(data.target.response.replace(/(empty|white|black)/g, '"$1"'));
            console.log(newBoard);
            this_game.board = newBoard;
            this_game.boards.push(newBoard);
            this_game.nextPlayer();
            this_game.move_ready = true;
            this_game.score++;
        });
    }

    getMove(board, newBoard) {

        let origin = [];
        let dest = [];

        for (let i = 0; i < board.length; ++i) {
            for (let j = 0; j < board.length; ++j) {
                if (board[i][j] === 'empty' && newBoard[i][j] !== 'empty') {
                    dest = [i, j];
                } else if (board[i][j] !== 'empty' && newBoard[i][j] === 'empty') {
                    origin = [i, j];
                }
            }
        }
        origin.push(dest[0], dest[1]);
        return origin;
    }

    undoMove() {

        let this_game = this;
        if (this_game.boards.length > 1) {
            let last_board = this_game.boards[this_game.boards.length - 1];
            let second_last_board = this_game.boards[this_game.boards.length - 2];
            this_game.undo_move = this_game.getMove(last_board, second_last_board);
            this_game.boards.pop();
            this_game.undo_ready = true;
            this_game.board = this_game.boards[this_game.boards.length - 1];
        }
    }

    choose_move() {
        let this_game = this;
        let board_string = this.getBoardString();

        this.server.getPrologRequest("choose_move([" + board_string + "]," + this.difficulty + "," + this.currPlayer + ")", function (data) {
            let newBoard = JSON.parse(data.target.response.replace(/(empty|white|black)/g, '"$1"'));
            this_game.bot_move = this_game.getMove(this_game.board, newBoard);
            this_game.board = newBoard;
            this_game.boards.push(newBoard);
            this_game.nextPlayer();
            this_game.bot_ready = true;
        });
    }

    gameOver() {
        let this_game = this;
        let board_string = this.getBoardString();

        this.server.getPrologRequest("game_over([" + board_string + "])", function (data) {
            console.log(data.target.response);
            this_game.winner = parseInt(data.target.response);

            if (this_game.winner != 0) {
                this_game.initData();
            }
            this_game.winner_ready = true;
        });
    }

    resetTimer(timer = true) {
        this.time = this.maxTime;
        this.elapsedTime = this.maxTime * 1000;
        this.timer = timer;
    }

    stopTimer() {
        this.timer = false;
    }

    update(deltaTime) {

        if (this.timer) {
            this.elapsedTime -= deltaTime;

            this.time = Math.floor(this.elapsedTime / 1000);

            if (this.time === 0) {
                this.turnOver = true;
                this.resetTimer();
            }
        }

    }
}