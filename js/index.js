const board = new BoardManager(".board", 3);


const A = new HumanPlayer("X", "onadakoa");
board.setPlayer(0, A);
const B = new HumanPlayer("O", "alexander")
board.setPlayer(1, B);