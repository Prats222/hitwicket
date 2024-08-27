// Initialize the game state with the board setup and player turn
function initializeGame() {
  return {
    board: [
      ["H1", "P1", null, "P2", "H2"], // Player1's characters (H1: Hero, P1: Pawn)
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      ["H2", "P2", null, "P1", "H1"], // Player2's characters (H2: Hero, P2: Pawn)
    ],
    currentPlayer: "Player1", // Set the current player
    isGameOver: false, // Initial game over state
    winner: null, // Winner is initially set to null
  };
}

// Validate if the player's move is valid based on the game rules
function isValidMove(gameState, move) {
  const { row, col, targetRow, targetCol } = move;

  // Ensure the move is within the board boundaries
  if (
    row < 0 ||
    row >= 5 ||
    col < 0 ||
    col >= 5 ||
    targetRow < 0 ||
    targetRow >= 5 ||
    targetCol < 0 ||
    targetCol >= 5
  ) {
    return false;
  }

  // Ensure that the player is moving their own piece
  const piece = gameState.board[row][col];
  if (!piece || !piece.startsWith(gameState.currentPlayer.charAt(0))) {
    return false;
  }

  // Ensure the target position is either empty or occupied by an opponent's piece
  const targetPiece = gameState.board[targetRow][targetCol];
  if (
    targetPiece &&
    targetPiece.startsWith(gameState.currentPlayer.charAt(0))
  ) {
    return false;
  }

  // Check specific movement rules for each type of piece
  if (piece.endsWith("P1") || piece.endsWith("P2")) {
    // Pawns can only move forward one square
    const direction = gameState.currentPlayer === "Player1" ? 1 : -1;
    if (targetRow === row + direction && targetCol === col) {
      return true;
    }
  } else if (piece.endsWith("H1") || piece.endsWith("H2")) {
    // Heroes can move one square in any direction
    if (Math.abs(targetRow - row) <= 1 && Math.abs(targetCol - col) <= 1) {
      return true;
    }
  }

  return false; // Return false if none of the rules apply
}

// Process the player's move and update the game state
function processMove(gameState, move) {
  const { row, col, targetRow, targetCol } = move;
  const piece = gameState.board[row][col];

  // Move the piece to the target position
  gameState.board[targetRow][targetCol] = piece;
  gameState.board[row][col] = null;

  // Switch turns between Player1 and Player2
  gameState.currentPlayer =
    gameState.currentPlayer === "Player1" ? "Player2" : "Player1";

  return gameState;
}

// Check if the game is over and determine the winner
function checkGameOver(gameState) {
  // Check if one player has captured the opponent's Hero
  const player1HeroExists = gameState.board.flat().includes("H1");
  const player2HeroExists = gameState.board.flat().includes("H2");

  if (!player1HeroExists) {
    gameState.isGameOver = true;
    gameState.winner = "Player2";
    return "Player2";
  } else if (!player2HeroExists) {
    gameState.isGameOver = true;
    gameState.winner = "Player1";
    return "Player1";
  }

  return null; // Return null if the game is not over
}

module.exports = {
  initializeGame,
  isValidMove,
  processMove,
  checkGameOver,
};
