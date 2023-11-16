import { useState } from 'react';

function Square({ value, onSquareClick, isWinnerSquare }) {
   const squareStyle = {
    backgroundColor: isWinnerSquare ? 'green' : 'blue',
  };
  return (
    <button className="p-0 m-0 border font-bold text-2xl sm:text-8xl w-8 h-8 sm:h-32 sm:w-32 text-center" style={squareStyle} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ status, xIsNext, squares, onPlay, winnerInfo }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
      isWinnerSquare={winnerInfo && winnerInfo.line.includes(i)}
    />
  );

   const renderBoardRow = (start, winnerLine) => {
    const row = [];
    for (let i = start; i < start + 3; i++) {
      const isWinnerSquare = winnerLine && winnerLine.includes(i);
      row.push(renderSquare(i, isWinnerSquare));
    }
    return row;
  };

  const boardRows = [0, 3, 6].map((start) => (
    <div key={start} className="board-row">
      {renderBoardRow(start)}
    </div>
  ));

  //const winner = calculateWinner(squares);
  
  return (
    <>
      <div className= 'text-black text-2xl text-center pr-20 sm:text-5xl max-w-sm mt-2 sm:mt-8 mx-auto sm:ml-16 bg-yellow-500 rounded'>{status}</div>
      <div className='grid grid-cols-3 gap-0 w-24 sm:w-96 ml-16 mt-4'>{boardRows}</div>
    </>
  );
}

export default function Game() {
  
  const [isAscending, setIsAscending] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winnerInfo = calculateWinner(currentSquares);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  let status;
  if (winnerInfo) {
    status = 'Winner: ' + winnerInfo.winner;
  } else if (currentSquares.every(square => square !== null)) {
    // If all squares are filled and no winner, it's a draw
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  
  const moves = history.map((squares, move) => {
    // Determine the col and row based on the move
    const col = (move - 1) % 3;
    const row = Math.floor((move - 1) / 3);
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';

    return (
      <li key={move} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded py-2 mt-2 max-w-sm">
        {move === currentMove ? (
          <div className='bg-green-500'><strong>{`You are at move #${move}`}</strong></div>
        ) : (
          <button onClick={() => jumpTo(move)}>{`${description} (${row}, ${col})`}</button>
        )}
      </li>
    );
  });
  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="bg-slate-400 h-screen text-center flex flex-col sm:flex-row gap-auto">
      <div className="flex-1">
        <Board status={status} winnerInfo={winnerInfo} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="flex-1 -translate-x-12 sm:translate-x-0">
        {winnerInfo && <Congratulations winner={winnerInfo.winner} />}
        <div>
          <button className='hover:bg-yellow-700 text-black font-medium bg-yellow-500 sm:-translate-x-32 sm:mt-8' onClick={toggleSort}>
            Sort Moves: {isAscending ? 'Ascending' : 'Descending'}
          </button>
        </div>
         
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function Congratulations({ winner }) {
  return (
    <div flex>
      {/*<div className="animate-congrats-animation text-3xl absolute inset-0 mr-80 mt-16 max-w-sm flex items-center justify-center opacity-75 font-serif font-extrabold rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500">
        <p>{`Congratulations Player ${winner} is the winner! 🎉🥳`}</p>
  </div>*/}
      <div className="animate-congrats-animation text-3xl fixed inset-0 ml-96 mt-16 max-w-sm flex items-center justify-center opacity-75 font-serif font-extrabold rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500">
        <p className='sm:visible'>{`Congratulations Player ${winner} is the winner! 🎉🥳`}</p>
      </div>
    </div>
  );
}
function calculateWinner(squares) {
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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
