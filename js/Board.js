const PLAYER_SYMBOL = {
    "X": 1,
    "O": -1,
    1: "X",
    [-1]: "O"
}

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
    currentPlayer = 1

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
        this.switchCurrentPlayer();

        this.renderBoard();
        this.evaluatePlayerMoveEvent();
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






