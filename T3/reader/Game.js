class Game {
    constructor(scene) {

        this.scene = scene;

        this.gameStates = Object.freeze({
            "MENU": 1,
            "DIFFICULTY": 2,
            "TIMER": 3,
            "SCENES": 4,
            "PVP": 5,
            "PVC": 6,
            "CVC": 7
        });

        this.difficulties = Object.freeze({
            "EASY": 2,
            "MEDIUM": 3,
            "HARD": 4,
        });

        this.maxTimes = [15, 30, 45, 60];
        this.maxTime = this.maxTimes[1];

        this.initData();
    }

    updateTimer(id) {
        this.maxTime = this.maxTimes[id - 1];
        this.time = this.maxTime;
        this.elapsedTime = this.maxTime * 1000;
    }

    initData() {
        let board = [
            ['empty', 'white', 'empty', 'white', 'empty'],
            ['empty', 'empty', 'black', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'white', 'empty', 'empty'],
            ['empty', 'black', 'empty', 'black', 'empty']
        ];
        this.board = board;
        this.currPlayer = 1;
        this.countOcurrences = [];
        this.boards = [board];
        this.players = [];
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
        this.currPlayer = 3 - this.currPlayer;
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

        this.getPrologRequest("valid_moves([" + board_string + "]," + piece_string + ")", function (data) {
            this_game.valid_moves = data.target.response;
            this_game.moves_ready = true;
        });
    }


    move(move) {
        let this_game = this;
        let board_string = this.getBoardString();

        this.getPrologRequest("move([" + move + "]," + this.currPlayer + ",[" + board_string + "])", function (data) {
            let newBoard = JSON.parse(data.target.response.replace(/(empty|white|black)/g, '"$1"'));
            this_game.board = newBoard;
            if (this_game.boards.length == 1) {
                this_game.first_to_play = this_game.currPlayer;
            }
            this_game.boards.push(newBoard);
            if (this_game.boards.length != 1) {
                this_game.players.push(this_game.currPlayer);
            }
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

    movieAnim() {

        if (!this.clicked_move) {
            this.clicked_move = true;
            if (this.boards.length > 1)
                this.setup_anim = true;
        }
    }

    getMovieMoves() {
        this.movie_moves = [];

        for (let i = 0; i < this.boards.length - 1; i++) {
            let movie_move = this.getMove(this.boards[i], this.boards[i + 1]);
            this.movie_moves.push(movie_move);
        }

        this.currAnim = 0;
        this.currAnimOver = true;
    }

    flagUndo() {
        if (this.gameState != this.gameStates.CVC) {
            if (this.boards.length > 1) {
                this.undo_ready = true;
            }
        }
    }

    undoMove() {

        let last_board = this.boards[this.boards.length - 1];
        let second_last_board = this.boards[this.boards.length - 2];
        this.undo_move = this.getMove(last_board, second_last_board);
        this.undo_player = this.players[this.players.length - 1];
        this.boards.pop();
        this.players.pop();
        this.board = this.boards[this.boards.length - 1];
    }


    choose_move() {
        this.move_chosen = true;
        let this_game = this;
        let board_string = this.getBoardString();

        this.getPrologRequest("choose_move([" + board_string + "]," + this.difficulty + "," + this.currPlayer + ")", function (data) {
            let newBoard = JSON.parse(data.target.response.replace(/(empty|white|black)/g, '"$1"'));
            this_game.bot_move = this_game.getMove(this_game.board, newBoard);
            this_game.board = newBoard;
            if (this_game.boards.length == 1) {
                this_game.first_to_play = this_game.currPlayer;
            }
            this_game.boards.push(newBoard);
            if (this_game.boards.length != 1) {
                this_game.players.push(this_game.currPlayer);
            }
            this_game.bot_ready = true;
            this_game.score++;
        });
    }

    gameOver() {
        let this_game = this;
        let board_string = this.getBoardString();

        this.getPrologRequest("game_over([" + board_string + "])", function (data) {
            this_game.winner = parseInt(data.target.response);
            this_game.winner_ready = true;
        });
    }

    resetTimer(timer = true) {
        this.time = this.maxTime;
        this.elapsedTime = this.maxTime * 1000;
        this.timer = timer;
    }

    setTimer(timer = false) {
        this.timer = timer;
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

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) {
            console.log("Request successful. Reply: " + data.target.response);
        };
        request.onerror = onError || function () {
            console.log("Error waiting for response");
        };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}