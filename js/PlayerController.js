


class PlayerController {
    /**
     *
     * @private
     * @type {number}
     */
    playerSymbol;
    getPlayerSymbol() { return this.playerSymbol }

    /**
     * @private
     * @type {string}
     */
    playerName;

    /**
     * @type {BoardController}
     */
    BoardController;

    /**
     * 
     * @param {PlayerSymbol} symbol X or O  
     * @param {string} playerName name of a player 
     */
    constructor(symbol, playerName) {
        this.playerSymbol = PLAYER_SYMBOL[symbol]
        this.playerName = playerName
    }


    /**
     * @abstract
     */
    myMove() { };

    /**
     * @abstract
     * @param {number} i 
     */
    boardClicked(i) { };

    /**
     * @param {BoardController} BoardController 
     */
    setupByBoard(BoardController) {
        this.BoardController = BoardController;
    }

}

