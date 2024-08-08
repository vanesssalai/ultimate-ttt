import React, { useState } from "react";
import NormalBoard from "./normalBoard";
import { FaRegCircle, FaTimes } from "react-icons/fa";

const UltimateBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");

  return (
    <div className="flex flex-col justify-center">
      <h1 className="flex items-center justify-center">
        Current Turn:
        {currentPlayer === "X" ? (
          <FaRegCircle className="text-red-500 ml-2" />
        ) : (
          <FaTimes className="text-blue-500 ml-2" />
        )}
      </h1>
      <div className="flex flex-col items-center justify-center m-1">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, index) => (
            <div
              key={index}
              className={`w-fit h-fit p-1 flex flex-col items-center justify-center border`
              }
            >
              {cell === "X" ? (
                <FaRegCircle className="text-red-500 text-4xl" />
              ) : cell === "O" ? (
                <FaTimes className="text-blue-500 text-4xl" />
              ) : null}
              <NormalBoard
                key={`local-board-${index}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UltimateBoard;