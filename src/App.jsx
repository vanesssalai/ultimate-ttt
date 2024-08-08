import React from 'react'
import './App.css'
import NormalBoard from './components/normalBoard'
import UltimateBoard from './components/ultimateBoard'

function App() {
  return (
    <>
      <h1 className='flex justify-center align-middle'>Ultimate Tic Tac Toe</h1>
      <button>Invite a Friend!</button>
      {/* <button>New Game</button> */}
      <UltimateBoard />
    </>
  )
}

export default App
