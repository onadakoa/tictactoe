
class MiniMaxPlayer extends PlayerController {
    enemySymbol;

    setup() {
        let tmp = this.getPlayerSymbol()
        if (tmp == 1) this.enemySymbol = -1;
        if (tmp == -1) this.enemySymbol = 1;
    }

    checkPlayerWin(board, symbol) {
        for (let i = 0; i < WIN_STATES.length; i++) {
            let winpos = 0;
            for (let k = 0; k < 3; k++) {
                if (board[WIN_STATES[i][k]] != symbol) break;
                winpos++;
            }
            if (winpos == 3) return [true, i];
        }
        return [false, -1];
    }

    /**
     * @returns {{index:number, value:number}[]}
     */
    getFreeCells(board = undefined) {
        let b = (board == undefined) ? this.BoardController.getBoard() : board;
        let out = []
        b.forEach((v, i) => {
            if (v != 0) return;
            out.push({ index: i, value: v })
        })
        return out;
    }

    myMove() {
        setTimeout(() => {
            let board = this.BoardController.getBoard();
            this.makeMove(this.minimax(board, this.getPlayerSymbol()).index)
        }, 1000);
    }

    /**
     * @param {number[]} nBoard
     * @param {number} playerSymbol
     */
    minimax(nBoard, playerSymbol) {
        let emptyCells = this.getFreeCells(nBoard)

        if (this.checkPlayerWin(nBoard, this.getPlayerSymbol())[0]) return { score: 10 };
        if (this.checkPlayerWin(nBoard, this.enemySymbol)[0]) return { score: -10 };
        if (emptyCells.length <= 0) return { score: 0 };

        let moves = [];

        for (let i = 0; i < emptyCells.length; i++) {
            let move = {};
            move.index = emptyCells[i].index//nBoard[emptyCells[i].index]

            nBoard[emptyCells[i].index] = playerSymbol;

            if (playerSymbol == this.getPlayerSymbol()) {
                let result = this.minimax(nBoard, this.enemySymbol)
                move.score = result.score;
            }
            else {
                let result = this.minimax(nBoard, this.getPlayerSymbol())
                move.score = result.score;
            }

            nBoard[emptyCells[i].index] = 0//move.index

            moves.push(move)
        }

        let bestMove;
        if (playerSymbol == this.getPlayerSymbol()) {
            let bestScore = -10000;

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestMove = i;
                    bestScore = moves[i].score
                }
            }
        } else {
            let bestScore = 10000;

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestMove = i;
                    bestScore = moves[i].score
                }
            }

        }


        return moves[bestMove];

    }
}