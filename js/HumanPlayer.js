


class HumanPlayer extends PlayerController {

    // /**
    //  * 
    //  * @param {string} playerName 
    //  * @param {PlayerSymbol} symbol X or O 
    //  */
    // constructor(playerName, symbol) {
    //     super(symbol, playerName)
    // }

    /**
     * @override 
     */
    boardClicked(i) {
        if (!this.BoardController.isMyMove()) return;
        if (this.BoardController.isCellOccupied(i)) return;
        this.BoardController.move(i);
    }

}