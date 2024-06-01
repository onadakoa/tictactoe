


class RandomPlayer extends PlayerController {

    randomMove(max = 8, min = 0) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    myMove() {
        setTimeout(() => {
            let tmp = 4;
            while (this.BoardController.isCellOccupied(tmp)) {
                if (this.BoardController.isBoardFull()) return;
                tmp = this.randomMove();
            }
            this.makeMove(tmp)
        }, 1000);

    }

}