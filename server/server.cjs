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
  console.log('New connection:', socket.id);

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substring(7);
    games.set(gameId, { players: [socket.id], gameState: null });
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', (gameId) => {
    console.log('Join game request:', gameId);
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
    console.log('Move made in game:', gameId, 'by player:', socket.id);
    console.log('New game state:', move);
    const game = games.get(gameId);
    if (game) {
      game.gameState = move;
      io.to(gameId).emit('moveMade', move);
      console.log('Move broadcast to room:', gameId);
    } else {
      console.error('Game not found:', gameId);
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
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));