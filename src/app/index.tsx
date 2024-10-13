// eslint-disable-next-line react/display-name
import React, { useCallback, useMemo, useState } from "react"

// Player type
type Player = 'X' | 'O' | null;

// Board type
type Board = Player[];

// winner meta information interface
interface WinningInfo {
  winner: Player;
  line: number[] | null;
};

function getWinnerAndLine(board:Board): WinningInfo {
  for(const[a,b,c] of winningCombinations) {
    if(board[a] && board[a] == board[b] && board[a] == board[c]) // same character, and all three required for winning combination exist on the board
      return {winner:board[a], line:[a,b,c]};
  }
  return {winner:null, line:null};
}

const winningCombinations = [
  // rows
  [0,1,2], [3,4,5],[6,7,8],
  // columns
  [0,3,6], [1,4,7], [2,5,8],
  // diagnols
  [0,4,8], [2,4,6]
];

// each square can be clicked, can be null/player/winning
interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinning: boolean;
}

const Square: React.FC<SquareProps> = React.memo(({value, onClick, isWinning}) => {
  // each square is a button with reactive settings
  return (
    <button className={`text-center font-bold w-20 h-20 flex items-center justify-center rounded ${isWinning
      ? 'text-white bg-green-700' : value ? 'text-white bg-[#C9C9C9]' : 'text-white bg-white hover:bg-[#E5E7EB]'
    }`} onClick={onClick}>{value}</button>
  );
});

const Home : React.FC = () => {

  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true); // X is true, and O is false
  const {winner, line} = useMemo(() => getWinnerAndLine(board), [board]);

  // display current player and final status

  const status = useMemo(()=> {
    if(winner) return `${winner} wins!`
    if(board.every(Boolean)) return "It's a draw!";

    return `${xIsNext ? 'X' : 'O'}'s turn.`
  }, [winner, board, xIsNext]);

  // reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const handleClick = useCallback((index: number) => {
    if(winner || board[index])
      return;

    // update board
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[index] = xIsNext ? 'X' : 'O'
      return newBoard;
    });

    // update player
    setXIsNext(prevXIsNext => !prevXIsNext);

  }, [winner, board, xIsNext]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111111] ">
      <h1 className="mb-4">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-2 flex items-center justify-center mb-4">
        {board.map((square, index) => (
            <Square
              key={index}
              value={square}
              onClick={() => handleClick(index)}
              isWinning = {line ? line.includes(index) : false}
            />
          ))}
      </div>
      <p className="mb-4">{status}</p>
      <button className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#98EE98]-600 dark:hover:bg-green-700 " onClick={resetGame}>New Game</button>
    </div>
  )
};

Home.displayName = "Home";

export default Home;