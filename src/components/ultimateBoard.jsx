import React, { useState, useEffect } from "react";
import NormalBoard from "./normalBoard";
import WinnerCard from "./winnerCard";
import { FaRegCircle, FaTimes } from "react-icons/fa";
import { createInitialState, makeMove, checkWinner } from "./gameLogic";
import { socket } from '../socket';

const UltimateBoard = ({ gameId, playerId, localPlayer }) => {
  const [gameState, setGameState] = useState(createInitialState());

  useEffect(() => {
    socket.on('gameStart', (initialState) => {
      setGameState(initialState);
    });
  
    socket.on('moveMade', (newState) => {
      setGameState(newState);
    });
  
    return () => {
      socket.off('gameStart');
      socket.off('moveMade');
    };
  }, [playerId]);

  const handleMove = (ultimateBoardIndex, normalBoardIndex) => {
    if (gameState.currentPlayer !== localPlayer) return;

    const newState = makeMove(gameState, ultimateBoardIndex, normalBoardIndex);
    setGameState(newState);
    socket.emit('makeMove', { gameId, move: newState });
  };

  const restartGame = () => {
    const newState = createInitialState();
    setGameState(newState);
    socket.emit('makeMove', { gameId, move: newState });
  };

  const ultimateWinner = checkWinner(gameState.ultimateBoard);

  const getBackgroundColor = (index) => {
    if (gameState.nextBoardIndex === null || gameState.nextBoardIndex === index) {
      return gameState.currentPlayer === "X" ? "bg-red-50" : "bg-blue-50";
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center m-4">
      <div className="mb-4">
        {!ultimateWinner && (
          <>
            Current Turn:
            {gameState.currentPlayer === "X" ? (
              <FaTimes className="inline-block ml-2 text-red-500" />
            ) : (
              <FaRegCircle className="inline-block ml-2 text-blue-500" />
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-gray-100">
        {gameState.ultimateBoard.map((cell, index) => (
          <div key={index} className={`p-4 ${getBackgroundColor(index)}`}>
            {cell ? (
              cell === "X" ? (
                <FaTimes className="w-full h-full text-red-500" />
              ) : (
                <FaRegCircle className="w-full h-full text-blue-500" />
              )
            ) : (
              <NormalBoard
                board={gameState.normalBoards[index]}
                onCellClick={(normalBoardIndex) => handleMove(index, normalBoardIndex)}
                disabled={
                  ultimateWinner ||
                  (gameState.nextBoardIndex !== null && gameState.nextBoardIndex !== index) ||
                  gameState.currentPlayer !== localPlayer
                }
              />
            )}
          </div>
        ))}
      </div>
      {ultimateWinner && (
        <WinnerCard winner={ultimateWinner} onRestart={restartGame} />
      )}
    </div>
  );
};

export default UltimateBoard;
