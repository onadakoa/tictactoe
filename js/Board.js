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
     * @type {[Object,Object]}
     */
    playersArray;

    /**
     *
     * @private
     * @type {number}
     */
    currentPlayer = 1

    /**
     * 
     * @param {number} [size=3]
     */
    constructor(size = 3) {
        this.boardSize = size;

        this.boardArray = new Array(size * size).fill(0)

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
                <div class="${classes}">${content}</div> 
            `)
            out += tmp.trim();
        })
        return out;
    }
}





let tmp = new BoardManager();


