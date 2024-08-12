import React, { useState, useEffect } from 'react';
import { socket } from "../socket";
import UltimateBoard from './ultimateBoard';
import { FaCopy } from 'react-icons/fa';

class SocketService {
  connect() {
    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log('Connected to socket server');
        resolve();
      });
      socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
        reject(error);
      });
    });
  }

  createGame(callback) {
    socket.emit('createGame');
    socket.on('gameCreated', callback);
  }

  joinGame(gameId, callback) {
    socket.emit('joinGame', gameId);
    socket.on('gameJoined', callback);
  }

  onGameJoined(callback) {
    socket.on('gameJoined', callback);
  }

  onGameStart(callback) {
    socket.on('gameStart', callback);
  }

  makeMove(gameId, move) {
    socket.emit('makeMove', { gameId, move });
  }

  onMoveMade(callback) {
    socket.on('moveMade', callback);
  }

  onPlayerLeft(callback) {
    socket.on('playerLeft', callback);
  }

  disconnect() {
    socket.disconnect();
  }
}

const socketService = new SocketService();

const GameLobby = ({ onGameStart }) => {
  const [gameId, setGameId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [createdGameId, setCreatedGameId] = useState('');
  const [localPlayer, setLocalPlayer] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);
        socketService.onGameStart(handleGameStart);
        socketService.onGameJoined(handleGameJoined);
      } catch (error) {
        console.error('Failed to connect to socket server:', error);
      }
    };
    connectSocket();
  }, []);

  const handleGameStart = ({ gameId, players }) => {
    setGameId(gameId);
    setPlayerId(socket.id);
    setLocalPlayer(players.indexOf(socket.id) === 0 ? 'X' : 'O');
    setGameStarted(true);
  };
  
  const handleGameJoined = ({ gameId, players }) => {
    setGameId(gameId);
    setPlayerId(socket.id);
    setLocalPlayer(players.indexOf(socket.id) === 0 ? 'X' : 'O');
  };
  const createGame = () => {
    if (!isConnected) return;
    socketService.createGame((id) => {
      setGameId(id);
      setCreatedGameId(id);
      setPlayerId(socket.id);
      setLocalPlayer('X'); 
    });
  };

  const joinGame = () => {
    if (!isConnected) return;
    socketService.joinGame(gameId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('GameID copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  if (!isConnected) {
    return <div>Connecting to server...</div>;
  }

  if (gameStarted) {
    console.log('Local Player:', localPlayer);
    return <UltimateBoard gameId={gameId} playerId={playerId} localPlayer={localPlayer} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center justify-center flex flex-col">
        <button onClick={createGame}>Create New Game</button>
        {createdGameId ? 
          (
            <div className="flex items-center justify-center mt-4">
              <p>GameID: {createdGameId}</p>
              <button
                className="ml-2 text-gray-400 mx-2 py-1 rounded-md"
                onClick={() => copyToClipboard(createdGameId)}
              >
                <FaCopy />
              </button>
            </div>
          ) : (
            <>
              <p className='m-4'>or</p>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID"
                className="border rounded-md"
              />
              <button onClick={joinGame}>Join Game</button>
            </>
        )}
      </div>
    </div>
  );
};

export default GameLobby;