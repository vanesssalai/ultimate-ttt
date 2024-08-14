# Ultimate Tic Tac Toe
Multiplayer Ultimate Tic Tac Toe using React, Express and Socketio

Try it [here](https://ultimate-ttt-wk1e.onrender.com)

## Getting Started
1. Clone the repo
``` bash
git clone https://github.com/vanesssalai/ultimate-ttt.git
```
2. Install dependencies
``` bash
npm install
```
3. Run application
``` bash
node server/server.cjs
npm run dev
```
4. Have Fun :)

## Rules
The goal is to win 3 of the nine Tic Tac Toe (TTT) Boards arranged in a 3x3 grid.

The game starts with the host, 'X'.

To win a small TTT board, like normal TTT, get 3 of your 'O' or 'X' symbols in a row.

The position you place your symbol in will determine which of the 9 boards your opponent will play in next.

For example, if you place your symbol in the top right cell of a small TTT board, your opponent must place their symbol on the top right board.

If a small board is already won or all the cells are filled, the opponent can choose any available cells in any other board.
