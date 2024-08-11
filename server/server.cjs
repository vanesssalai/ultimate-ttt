const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const games = new Map();

function createInitialState(players) {
  return {
    players: players,
    currentPlayer: 'X',
    ultimateBoard: Array(9).fill(null),
    normalBoards: Array(9).fill(Array(9).fill(null)),
    nextBoardIndex: null,
  };
}

io.on('connection', (socket) => {
  console.log('new connection');

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substring(7);
    games.set(gameId, { players: [socket.id], gameState: null });
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', (gameId) => {
    const game = games.get(gameId);
    if (game && game.players.length < 2) {
      game.players.push(socket.id);
      socket.join(gameId);
      io.to(gameId).emit('gameJoined', { gameId, players: game.players });
      if (game.players.length === 2) {
        const initialState = createInitialState(game.players);
        game.gameState = initialState;
        io.to(gameId).emit('gameStart', initialState);
      }
    } else {
      socket.emit('gameError', 'Game not found or full');
    }
  });

  socket.on('makeMove', ({ gameId, move }) => {
    const game = games.get(gameId);
    if (game) {
      game.gameState = move;
      io.to(gameId).emit('moveMade', move);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    games.forEach((game, gameId) => {
      const index = game.players.indexOf(socket.id);
      if (index !== -1) {
        game.players.splice(index, 1);
        io.to(gameId).emit('playerLeft', socket.id);
        if (game.players.length === 0) {
          games.delete(gameId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));