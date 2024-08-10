export const createInitialState = () => ({
  ultimateBoard: Array(9).fill(null),
  normalBoards: Array(9).fill(Array(9).fill(null)),
  currentPlayer: 'X',
  nextBoardIndex: null,
});

export const checkWinner = (board) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
};

export const makeMove = (state, ultimateBoardIndex, normalBoardIndex) => {
  if (state.nextBoardIndex !== null && state.nextBoardIndex !== ultimateBoardIndex) {
    return state; 
  }

  const newNormalBoards = state.normalBoards.map((board, index) =>
    index === ultimateBoardIndex 
      ? board.map((cell, cellIndex) => cellIndex === normalBoardIndex && cell === null
        ? state.currentPlayer
          : cell
      )
      : board
  );

  const newUltimateBoard = state.ultimateBoard.map((cell, index) =>
    index === ultimateBoardIndex
      ? checkWinner(newNormalBoards[ultimateBoardIndex]) || cell
      : cell
  );

  const nextBoardIndex =
    newNormalBoards[normalBoardIndex].every((cell) => cell !== null) ||
    checkWinner(newNormalBoards[normalBoardIndex])
      ? null
      : normalBoardIndex;

  return {
    ultimateBoard: newUltimateBoard,
    normalBoards: newNormalBoards,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    nextBoardIndex,
  };
};