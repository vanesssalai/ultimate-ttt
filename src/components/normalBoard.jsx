import React, { useState } from "react";
import { FaRegCircle, FaTimes } from "react-icons/fa";

const NormalBoard = ({ board, onCellClick, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <div
          key={index}
          className={`min-w-10 min-h-10 bg-gray-200 flex items-center justify-center ${
            !disabled && cell === null ? "cursor-pointer" : "cursor-not-allowed"
          }`}
          onClick={() => !disabled && cell === null && onCellClick(index)}
        >
          {cell === "X" ? (
            <FaTimes className="text-red-500" />
          ) : cell === "O" ? (
            <FaRegCircle className="text-blue-500" />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NormalBoard;