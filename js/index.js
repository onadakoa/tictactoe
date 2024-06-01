const board = new BoardManager(".board", 3);


const A = new HumanPlayer("X", "onadakoa", "#A");
board.setPlayer(0, A);
const B = new MiniMaxPlayer("O", "alexander", "#B")
board.setPlayer(1, B);


board.startGame("X")