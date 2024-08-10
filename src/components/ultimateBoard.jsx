import React, { useState } from "react";
import NormalBoard from "./normalBoard";
import WinnerCard from "./winnerCard";
import { FaRegCircle, FaTimes } from "react-icons/fa";
import { createInitialState, makeMove, checkWinner } from "./gameLogic";

const UltimateBoard = () => {
  const [gameState, setGameState] = useState(createInitialState());

  const handleMove = (ultimateBoardIndex, normalBoardIndex) => {
    setGameState((prevState) => makeMove(prevState, ultimateBoardIndex, normalBoardIndex));
  };

  const ultimateWinner = checkWinner(gameState.ultimateBoard);

  const getBackgroundColor = (index) => {
    if (gameState.nextBoardIndex === null || gameState.nextBoardIndex === index) {
      return gameState.currentPlayer === "X" ? "bg-red-50" : "bg-blue-50";
    }
    return "";
  };

  return (
    <div className="flex flex-col justify-center">
      <h1 className="flex items-center justify-center text-xl">
        {!ultimateWinner && (
          <>
            Current Turn: 
            {gameState.currentPlayer === "X" ? (
              <FaRegCircle className="text-red-500 ml-2" />
            ) : (
              <FaTimes className="text-blue-500 ml-2" />
            )}
          </>
        )}
      </h1>
      <div className="flex flex-col items-center justify-center m-1">
        <div className="grid grid-cols-3 gap-2">
          {gameState.ultimateBoard.map((cell, index) => (
            <div
              key={index}
              className={`w-fit h-fit p-1 flex flex-col items-center justify-center border ${getBackgroundColor(index)}`}
            >
              {cell ? (
                cell === "X" ? (
                  <FaRegCircle className="text-red-500 text-4xl" />
                ) : (
                  <FaTimes className="text-blue-500 text-4xl" />
                )
              ) : (
                <NormalBoard
                  key={`local-board-${index}`}
                  board={gameState.normalBoards[index]}
                  onCellClick={(normalBoardIndex) => handleMove(index, normalBoardIndex)}
                  disabled={
                    ultimateWinner ||
                    (gameState.nextBoardIndex !== null && gameState.nextBoardIndex !== index)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {ultimateWinner && (
        <WinnerCard winner={ultimateWinner} onRestart={restartGame} />
      )}
    </div>
  );
};

export default UltimateBoard;