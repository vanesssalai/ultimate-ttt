import React, { useState} from 'react'
import './App.css'
import UltimateBoard from './components/ultimateBoard'
import GameLobby from './components/gameLobby';

const App = () => {
  return (
    <>
      <h1 className='flex font-bold justify-center align-middle'>Ultimate Tic Tac Toe</h1>
      {/* <button>Invite a Friend!</button>
      <button>New Game</button> */}
      <div>
          <GameLobby />
      </div>
    </>
  )
}

export default App
