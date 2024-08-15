import React from "react";
import { FaRegCircle, FaTimes } from "react-icons/fa";

const NormalBoard = ({ board, onCellClick, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-1 w-full aspect-square">
      {board.map((cell, index) => (
        <div
          key={index}
          className={`w-full aspect-square bg-gray-200 flex items-center justify-center ${
            !disabled && cell === null ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          onClick={() => !disabled && cell === null && onCellClick(index)}
        >
          {cell === "X" ? (
            <FaTimes className="text-red-500 w-2/3 h-2/3" />
          ) : cell === "O" ? (
            <FaRegCircle className="text-blue-500 w-2/3 h-2/3" />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NormalBoard;