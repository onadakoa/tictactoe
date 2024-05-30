


class PlayerController {
    /**
     *
     * @private
     * @type {number}
     */
    playerSymbol;

    /**
     * 
     *  @param {PlayerSymbol} symbol X or O  
     */
    constructor(symbol) {
        this.playerSymbol = PLAYER_SYMBOL[symbol]
    }
}

