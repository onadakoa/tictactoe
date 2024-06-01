


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
    getPlayerName = () => { return this.playerName }
    namePlateSelector;

    /**
     * @type {BoardController}
     */
    BoardController;

    /**
     * 
     * @param {PlayerSymbol} symbol X or O  
     * @param {string} playerName name of a player 
     */
    constructor(symbol, playerName, playerNamePlateSelector = undefined) {
        this.playerSymbol = PLAYER_SYMBOL[symbol]
        this.playerName = playerName
        this.namePlateSelector = playerNamePlateSelector;
    }

    setNamePlateFocus = (status, setName = false) => {
        if (this.namePlateSelector != undefined) {
            /** @type {HTMLDivElement} */
            let div = document.querySelector(this.namePlateSelector)
            if (status) div.classList.add("focused");
            if (!status) div.classList.remove("focused");
            if (setName) div.innerHTML = this.playerName
        }
    }

    BmyMove() {
        this.setNamePlateFocus(true)
        this.myMove();
    };
    /**
     * @abstract
     */
    myMove() { };


    /**
     * @param {number} index 
     */
    makeMove(index) {
        this.setNamePlateFocus(false)
        this.BoardController.move(index)
    }



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
        this.setNamePlateFocus(this.BoardController.isMyMove(), true)
        this.setup();
    }

    /**
     * @abstract
     */
    setup() { }

}

