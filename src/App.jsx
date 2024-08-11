import React, { useState} from 'react'
import './App.css'
import UltimateBoard from './components/ultimateBoard'
import GameLobby from './components/gameLobby';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStart = () => {
    setGameStarted(true);
  };

  return (
    <>
      <h1 className='flex font-bold justify-center align-middle'>Ultimate Tic Tac Toe</h1>
      {/* <button>Invite a Friend!</button>
      <button>New Game</button> */}
      <div>
        {!gameStarted ? (
          <GameLobby onGameStart={handleGameStart} />
        ) : (
          <UltimateBoard />
        )}
      </div>
    </>
  )
}

export default App
