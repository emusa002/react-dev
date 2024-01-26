import { useState } from 'react';

// Renders a single square on the board, which displays its current value ('X', 'O', or null)
// and triggers onSquareClick when clicked.
function Square({ value, onSquareClick }) {
  // value: The current value of the square ('X', 'O', or null) in the tic-tac-toe game.
  // onSquareClick: A callback function to handle the click event on the square.
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/* The Board component is responsible for rendering the tic-tac-toe game board. It maps the 
'squares' array to Square components, passing the value and a click handler to each. It also 
calculates and displays the game status (current player or winner).
*/
function Board({ xIsNext, squares, onPlay }) {
  // xIsNext: A boolean value indicating if it's player 'X's turn (true) or player 'O's turn (false).
  // squares: An array of 9 elements representing the current state of the tic-tac-toe board.
  // onPlay: A callback function that updates the game state when a player makes a move.

  // Handles click events for each square. It checks for a winner or if the square is already filled.
  // If not, it updates the square's value based on the current player.
  function handleClick(i) {
    // i: The index of the square that was clicked. Used to update the corresponding element in the 'squares' array.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Determines the game status – whether there's a winner or who's the next player.
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Renders the 3x3 tic-tac-toe board with individual squares.
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Manages the game state: history of moves and the current move index.
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // Determines which player is next.
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Updates the game history and current move when a new play is made.
  function handlePlay(nextSquares) {
    // nextSquares: An array representing the new state of the board after the current move.

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Allows jumping to a previous move in the history.
  function jumpTo(nextMove) {
    // nextMove: The move number in the game history to which the game state should revert.
    setCurrentMove(nextMove);
  }

  // Renders a list of moves for navigating the game history.
  const moves = history.map((squares, move) => {
    let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Renders the game board and game info.
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Defines all possible winning lines on the board and checks if any have been met.
// Returns the winner ('X' or 'O') or null if there's no winner yet.
function calculateWinner(squares) {
  // squares: An array of 9 elements representing the current state of the tic-tac-toe board.
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
