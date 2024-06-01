const PLAYER_SYMBOL = {
    "X": 1,
    "O": -1,
    1: "X",
    [-1]: "O"
}

const WIN_STATES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const translateToSymbol = (number) => {
    if (number == 1) { return "close" }
    if (number == -1) { return "circle" }
    else return ""
}
const BOARD_CREATE_FUNC = (v, i, arr) => {
    let d = i + 1;
    let cls = "";
    if (d % 3 == 0) {
        cls += "Bright "
    }
    if (d % 3 == 1) {
        cls += "Bleft "
    }
    if (d <= 3) {
        cls += "Btop "
    }
    if (d > 6) {
        cls += "Bbottom "
    }
    return [cls, `<span class='material-symbols-outlined'>${translateToSymbol(v)}</span>`]
}
const copyObj = (any) => { return JSON.parse(JSON.stringify(any)) }

/**
 * @typedef {("X"|"O")} PlayerSymbol
 */



// BOARD EVENTS
/**
 * @type {((i:number) => void)[]}
 */
let BoardClickEvents = [];
/**
 * 
 * @param {(i:numebr)=>void} event 
 */
function addBoardEvent(event) {
    BoardClickEvents.push(event)
}
function BoardClicked(i) {
    BoardClickEvents.forEach((v) => v(i))
}


class BoardManager {

    /**
     *
     * @private 
     */
    boardSize;

    /**
     *
     * @private
     * @type {Number[]}
     */
    boardArray;

    /**
     *
     * @private
     * @type {[PlayerController, PlayerController]}
     */
    playersArray = new Array(2);

    /**
     *
     * @private
     * @type {number}
     */
    currentPlayer = 0

    /**
     * @type {PlayerController} 
     * @private
    */
    winner = undefined;
    /** 
     * @type {("init" | "playing" | "tie" | "winner")} 
     * @private
    */
    gameStatus = "init"
    getGameStatus() {
        return { status: this.gameStatus, winner: this.winner }
    }
    /** @type {(Board: BoardController) => void} */
    EndCallback = () => { };

    /** 
     * @type {number} 
     * @private
    */
    gameStartTimestamp = 0;
    /** 
    * @type {number} 
    * @private
    */
    gameEndTimestamp = 0;
    getGameDurationTimestamp() {
        if (this.gameStatus == "init") return 0;
        if (this.gameStatus == "playing") return (new Date()).getTime() - this.gameStartTimestamp;
        return this.gameEndTimestamp - this.gameStartTimestamp;
    }

    boardSelector;

    isBoardFull = () => {
        if (this.boardArray.filter((v) => v == 0).length >= 1) return false;
        return true;
    }

    /**
     * 
     * @param {number} [size=3]
     * @param {string} boardCssSelector
     */
    constructor(boardCssSelector, size = 3) {
        this.boardSize = size;
        this.boardSelector = boardCssSelector;
        this.boardArray = new Array(size * size).fill(0)

        addBoardEvent((i) => {
            this.playersArray.forEach(v => {
                if (v == undefined) return;
                v.boardClicked(i)
            })
        })

        this.renderBoard();
    }

    evaluatePlayerMoveEvent = () => {
        this.playersArray.forEach(v => { if (v.getPlayerSymbol() == this.currentPlayer) v.BmyMove() })
    }
    switchCurrentPlayer = () => {
        if (this.currentPlayer == 1) this.currentPlayer = -1;
        else if (this.currentPlayer == -1) this.currentPlayer = 1;
    }
    playerMadeMove = (index, symbol) => {
        if (typeof symbol != typeof 0) throw Error("symbol must be number");
        if (this.boardArray[index] != 0) throw Error(`Board cell is taken on ${index}`);

        this.boardArray[index] = symbol;
        this.renderBoard();
        if (this.checkEnd()) {
            this.gameEndTimestamp = (new Date()).getTime();
            this.EndCallback(this)
            return;
        };

        this.switchCurrentPlayer();
        this.evaluatePlayerMoveEvent();
    }


    /**
     * 
     * @param {PlayerSymbol} startPlayer 
     * @param {(Board: BoardManager)=>void} gameFinishedEvent
     */
    startGame(gameFinishedEvent, startPlayer = "X") {
        this.currentPlayer = PLAYER_SYMBOL[startPlayer]
        this.gameStatus = "playing"
        this.EndCallback = gameFinishedEvent
        this.boardArray.fill(0)

        this.gameStartTimestamp = (new Date()).getTime()
        this.gameEndTimestamp = 0;
        this.evaluatePlayerMoveEvent();
    }

    /**
     * @param {number} playerSymbol 0 or 1 
     * @returns {[boolean, number]}
     */
    checkPlayerWin(playerSymbol) {
        for (let i = 0; i < WIN_STATES.length; i++) {
            let winpos = 0;
            for (let k = 0; k < 3; k++) {
                if (this.boardArray[WIN_STATES[i][k]] != playerSymbol) break;
                winpos++;
            }
            if (winpos == 3) return [true, i];
        }
        return [false, -1];
    }
    checkEnd() {
        /** @type {PlayerController} */
        let winner = 0;
        this.playersArray.forEach(p => {
            if (this.checkPlayerWin(p.getPlayerSymbol())[0]) winner = p;
        })

        if (winner != 0) {
            //win
            // console.log("winner: ", winner.getPlayerName())
            this.winner = winner;
            this.gameStatus = "winner"
            return true;
        };
        if (this.getEmptyCells().length <= 0) {
            //tie
            // console.log("tie")
            this.gameStatus = "tie"
            return true
        }

        return false;
    }

    /**
     * @returns {{index:number, value:number}[]} 
     */
    getEmptyCells() {
        /** @type {number[]} */
        let tmp = copyObj(this.boardArray)
        let out = []
        tmp.forEach((v, i) => {
            if (v == 0) out.push({ index: i, value: v })
        })
        return out;
    }
    /**
     * @param {number} symbol 
     * @returns {PlayerController}
     */
    getPlayerBySymbol(symbol) {
        let out = null;
        this.playersArray.forEach(p => { if (p.getPlayerSymbol() == symbol) out = p; });
        return out;
    }

    /**
     *
     *
     * @return {string} 
     * @param {(value: number, index: number, object: number[]) => string[]} [createClass=() => ["", ""]] 
     */
    renderHtml(createClass = (v, i, o) => ["", ""]) {
        let out = ""
        this.boardArray.forEach((v, i, obj) => {
            let [classes, content] = createClass(v, i, obj);

            let tmp = (`
                <div class="${classes}" onclick="BoardClicked(${i})">${content}</div> 
            `)
            out += tmp.trim();
        })
        return out;
    }

    /**
     * @private
     */
    renderBoard() {
        let boardTree = document.querySelector(this.boardSelector)
        if (boardTree == null) throw Error(`can't find ${this.boardSelector} selector`);
        boardTree.innerHTML = this.renderHtml(BOARD_CREATE_FUNC);
    }

    /**
     * 
     * @param {number} index 0 or 1 
     * @param {PlayerController} controller 
     */
    setPlayer(index, controller) {
        let tmp = new BoardController(controller.getPlayerSymbol());
        tmp.makeMove = this.playerMadeMove;
        tmp.getCurrentPlayer = () => { return this.currentPlayer }
        tmp.isCellOccupied = (index) => {
            if (this.boardArray[index] != 0) return true;
            return false
        }
        tmp.isBoardFull = () => { return this.isBoardFull() }
        tmp.getBoard = () => { return copyObj(this.boardArray) }

        controller.setupByBoard(tmp)
        this.playersArray[index] = controller;
    }
}


class BoardController {

    playerSymbol;
    /**
     * @type {(index: number) => boolean}
     */
    isCellOccupied;
    isBoardFull;
    /**
     *  @type {() => number[]}
     */
    getBoard;

    constructor(playerSymbol) {
        this.playerSymbol = playerSymbol;
    }

    /**
     * @type {((index, symbol) => void)}
     * @private
     */
    makeMove;

    /**
     * @param {number} index 
     */
    move(index) {
        this.makeMove(index, this.playerSymbol)
    }


    /**
     * @type {()=>number}
     */
    getCurrentPlayer;
    isMyMove() {
        if (this.getCurrentPlayer() == this.playerSymbol) return true;
        return false;
    }
}






