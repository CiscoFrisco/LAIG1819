class Game {
    constructor(scene) {
        this.board = [
            ['empty', 'white', 'empty', 'white', 'empty'],
            ['empty', 'empty', 'black', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'white', 'empty', 'empty'],
            ['empty', 'black', 'empty', 'black', 'empty']
        ];
        this.currPlayer = 1;

        this.server = new Server();

        this.scene = scene;

        this.gameStates = Object.freeze({
            "menu": 1,
            "difficulty": 2,
            "pvp": 3,
            "pvc": 4,
            "cvc": 5
        });
        this.gameState = this.gameStates.menu;
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

    getValidMoves(piece) {

        let piece_string = this.parseArrayToString(piece);
        let board_string = '';
        let this_game = this;

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

        console.log("valid_moves([" + board_string + "]," + piece_string + ")");
        
        this.server.getPrologRequest("valid_moves([" + board_string + "]," + piece_string + ")", function (data) {
            this_game.valid_moves = data.target.response;
        });

        console.log(this_game.valid_moves);

        return this_game.valid_moves;
    }

    move(move) {
        let this_game = this;

        this.server.getPrologRequest("move([" + move + "]," + this.currPlayer + ",[" + this.board + "])", function (data) {
            console.log(data.target.response);
        });
    }

    update() {
        this.getValidMoves();
    }
}