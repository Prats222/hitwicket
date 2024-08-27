const socket = new WebSocket("ws://localhost:8080");

// DOM Elements
const gameBoard = document.getElementById("game-board");
const currentPlayerElement = document.getElementById("current-player");
const gameStatusElement = document.getElementById("game-status");

// Initialize the game board with empty cells
function initializeBoard(board) {
  gameBoard.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;
      cellElement.textContent = cell;
      cellElement.addEventListener("click", handleCellClick);
      gameBoard.appendChild(cellElement);
    });
  });
}

// Handle cell click events
function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  const move = {
    type: "player_move",
    move: {
      row: row,
      col: col,
      targetRow: prompt("Enter target row:"),
      targetCol: prompt("Enter target column:"),
    },
  };

  socket.send(JSON.stringify(move));
}

// Update the game board based on the server's state
function updateBoard(board) {
  Array.from(gameBoard.children).forEach((cellElement) => {
    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);
    cellElement.textContent = board[row][col];
  });
}

// Update the current player display
function updateCurrentPlayer(player) {
  currentPlayerElement.textContent = player;
}

// Show game over status
function showGameOver(winner) {
  gameStatusElement.textContent = `${winner} wins!`;
}

// WebSocket event listeners
socket.addEventListener("open", () => {
  console.log("Connected to the server");
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  if (message.type === "game_init") {
    initializeBoard(message.data.board);
    updateCurrentPlayer(message.data.currentPlayer);
  } else if (message.type === "state_update") {
    updateBoard(message.data.board);
    updateCurrentPlayer(message.data.currentPlayer);
  } else if (message.type === "game_over") {
    showGameOver(message.winner);
  } else if (message.type === "invalid_move") {
    
    alert("Invalid move! Please try again.");
  }
});

socket.addEventListener("close", () => {
  console.log("Disconnected from the server");
});
