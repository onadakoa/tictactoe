


class HumanPlayer extends PlayerController {


    /**
     * @override 
     */
    boardClicked(i) {
        if (!this.BoardController.isMyMove()) return;
        if (this.BoardController.isCellOccupied(i)) return;
        this.makeMove(i)
    }

}