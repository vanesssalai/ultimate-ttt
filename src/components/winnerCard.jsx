import React from 'react';
import { FaRegCircle, FaTimes } from "react-icons/fa";

const WinnerCard = ({ winner, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">
          Winner: 
          {winner === 'X' ? (
            <FaRegCircle className="text-red-500 inline-block ml-2" size={24} />
          ) : (
            <FaTimes className="text-blue-500 inline-block ml-2" size={24} />
          )}
        </p>
        <button
          onClick={onRestart}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinnerCard;