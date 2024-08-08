import React, { useState } from "react";
import { FaRegCircle, FaTimes } from "react-icons/fa";

const NormalBoard = () => {
  const [board, setBoard] = useState(Array(9).fill(null));

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <div
          key={index}
          className="min-w-10 min-h-10 bg-gray-200 flex items-center justify-center cursor-pointer"
        >
          {cell === "X" ? (
            <FaRegCircle className="text-red-500" />
          ) : cell === "O" ? (
            <FaTimes className="text-blue-500" />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NormalBoard;