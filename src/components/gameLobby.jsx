import React, { useState, useEffect } from 'react';
import { socket } from "../socket";
import UltimateBoard from './ultimateBoard';
import { FaCopy } from 'react-icons/fa';
import { FaRegCircle, FaTimes } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

const GameLobby = () => {
  const [gameId, setGameId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [createdGameId, setCreatedGameId] = useState('');
  const [localPlayer, setLocalPlayer] = useState(null);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    };

    const handleConnectError = (error) => {
      console.error('Connection error:', error);
    };

    const handleGameStart = (initialState) => {
      console.log('Game started:', initialState);
      setGameId(gameId);
      setPlayerId(socket.id);
      const isFirstPlayer = initialState.players.indexOf(socket.id) === 0;
      setLocalPlayer(isFirstPlayer ? 'X' : 'O');
      setGameStarted(true);

      toast.success(
        `Game started! ${isFirstPlayer ? "It's your turn!" : "Waiting for opponent's move."}`,
        {
          icon: isFirstPlayer 
            ? <FaTimes className="text-red-500" />
            : <FaRegCircle className="text-blue-500" />,
          duration: 4000,
        }
      );
    };

    const handleGameJoined = ({ gameId, players }) => {
      console.log('Game joined:', gameId, players);
      setGameId(gameId);
      setPlayerId(socket.id);
      setLocalPlayer(players.indexOf(socket.id) === 0 ? 'X' : 'O');
    };

    const handleGameCreated = (id) => {
      console.log('Game created:', id);
      setGameId(id);
      setCreatedGameId(id);
      setPlayerId(socket.id);
      setLocalPlayer('X');
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('gameStart', handleGameStart);
    socket.on('gameJoined', handleGameJoined);
    socket.on('gameCreated', handleGameCreated);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('gameStart', handleGameStart);
      socket.off('gameJoined', handleGameJoined);
      socket.off('gameCreated', handleGameCreated);
    };
  }, [gameId]);

  const createGame = () => {
    if (!isConnected) return;
    console.log('Emitting createGame event');
    socket.emit('createGame');
  };

  const joinGame = () => {
    if (!isConnected) return;
    console.log('Emitting joinGame event:', gameId);
    socket.emit('joinGame', gameId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('GameID copied to clipboard');
      toast.success('GameID copied to clipboard.')
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  if (!isConnected) {
    return <div>Connecting to server...</div>;
  }

  console.log('Rendering, gameStarted:', gameStarted, 'gameId:', gameId);

  if (gameStarted && gameId) {
    console.log('Rendering UltimateBoard with gameId:', gameId);
    return <UltimateBoard gameId={gameId} playerId={playerId} localPlayer={localPlayer} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center justify-center flex flex-col">
        <button onClick={createGame} className="border-gray-400 rounded-md border-2 hover:text-white hover:bg-gray-400">Create New Game</button>
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
              <p className="m-4">or</p>
              <input
                type="text"
                value={gameId || ''}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter Game ID"
                className="border-2 rounded-md"
              />
              <button onClick={joinGame} className="border-gray-400 rounded-md border-2 hover:text-white hover:bg-gray-400 my-2">Join Game</button>
            </>
        )}
      </div>
    </div>
  );
};

export default GameLobby;