import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router";

const GRID_SIZE = 2; // Number of rows and columns (5x5 grid)

function GameScreen() {
  const [selectedDot, setSelectedDot] = useState(null);
  const [lines, setLines] = useState([]); // Tracks drawn lines
  const [currentPlayer, setCurrentPlayer] = useState(localStorage.getItem("turn") === localStorage.getItem("userName") ? 1 : 2);
  const [roomId, setRoomId] = useState(localStorage.getItem("roomId"));
  const [myTurn, setMyTurn] = useState(localStorage.getItem("turn") === localStorage.getItem("userName"));
  const [player1, setPlayer1] = useState(localStorage.getItem("player1"));
  const [player2, setPlayer2] = useState(localStorage.getItem("player2"));
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const navigate = useNavigate()
  
  useEffect(() => {

    socket.on("won",({message}) => {
      alert(message)
      navigate("/")
    })

    socket.on("lose",({message}) => {
      alert(message)
      navigate("/")
    })

    socket.on("play-game", ({ turn, player1, player2, score1, score2 }) => {
      setPlayer1(player1);
      setPlayer2(player2);
      setScores({ player1: score1, player2: score2 });
      setMyTurn(turn === localStorage.getItem("userName"));
      localStorage.setItem("turn",turn)
    });

    socket.on("move-played-square", ({ lines, scores,turn }) => {
      setLines(lines);
      setScores(scores);
      setMyTurn(turn === localStorage.getItem("userName"));
    });

    socket.on("update-game",({lines,scores,turn}) => {
      localStorage.setItem("turn",turn)
      setLines(lines)
      setScores(scores)
      setMyTurn(turn === localStorage.getItem("userName"))
    })

    return () => {
      socket.off("play-game")
      socket.off("move-played-square")
      socket.off("won")
      socket.off("lose")
    }

  }, []);

  const handleDotClick = (row, col) => {
    // debugger
    if (!myTurn) return; // Disable clicks if it's not the user's turn

    if (selectedDot) {
      const [prevRow, prevCol] = selectedDot;

      // Check if clicked dot is an adjacent neighbor
      if (
        (Math.abs(prevRow - row) === 1 && prevCol === col) || // Vertical neighbor
        (Math.abs(prevCol - col) === 1 && prevRow === row) // Horizontal neighbor
      ) {
        // Add a line
        const newLine = {
          from: selectedDot,
          to: [row, col],
        };
        const newLines = [...lines, newLine];
        setLines(newLines);

        // Check for square completion
        const squaresCompleted = checkForSquare(newLine);

        const newScores = { ...scores };
        if (squaresCompleted > 0) {
          newScores[`player${currentPlayer}`] += squaresCompleted;
          setScores(newScores);
          if(lines.length == ((GRID_SIZE * (GRID_SIZE - 1) * 2) - 1))
          {
            // alert(1)
            socket.emit('game-completed',{scores,winner:localStorage.getItem("userName"),roomId})
          }
          socket.emit("move-played-square", { lines: newLines, scores: newScores, roomId,userName: localStorage.getItem("userName") });
        } else {
          // Switch turn only if no square is completed
          socket.emit("move-played",{lines:newLines,scores,roomId,userName: localStorage.getItem("userName")})
          setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
          setMyTurn(false);
        }

        setSelectedDot(null); // Reset selection
      } else {
        setSelectedDot([row, col]); // Change selection
        return;
      }
    } else {
      setSelectedDot([row, col]);
    }
  };

  const checkForSquare = ({ from, to }) => {
    const [r1, c1] = from;
    const [r2, c2] = to;
    let squaresCompleted = 0;

    // Check for potential squares above or below for horizontal lines
    if (r1 === r2) {
      // Horizontal line
      if (
        r1 > 0 && // Check top square
        isLineDrawn({ from: [r1 - 1, c1], to: [r1 - 1, c2] }) &&
        isLineDrawn({ from: [r1 - 1, c1], to: [r1, c1] }) &&
        isLineDrawn({ from: [r1 - 1, c2], to: [r1, c2] })
      ) {
        squaresCompleted++;
      }
      if (
        r1 < GRID_SIZE - 1 && // Check bottom square
        isLineDrawn({ from: [r1 + 1, c1], to: [r1 + 1, c2] }) &&
        isLineDrawn({ from: [r1, c1], to: [r1 + 1, c1] }) &&
        isLineDrawn({ from: [r1, c2], to: [r1 + 1, c2] })
      ) {
        squaresCompleted++;
      }
    }

    // Check for potential squares to the left or right for vertical lines
    if (c1 === c2) {
      // Vertical line
      if (
        c1 > 0 && // Check left square
        isLineDrawn({ from: [r1, c1 - 1], to: [r2, c1 - 1] }) &&
        isLineDrawn({ from: [r1, c1 - 1], to: [r1, c1] }) &&
        isLineDrawn({ from: [r2, c1 - 1], to: [r2, c1] })
      ) {
        squaresCompleted++;
      }
      if (
        c1 < GRID_SIZE - 1 && // Check right square
        isLineDrawn({ from: [r1, c1 + 1], to: [r2, c1 + 1] }) &&
        isLineDrawn({ from: [r1, c1], to: [r1, c1 + 1] }) &&
        isLineDrawn({ from: [r2, c1], to: [r2, c1 + 1] })
      ) {
        squaresCompleted++;
      }
    }

    return squaresCompleted;
  };

  const isLineDrawn = ({ from, to }) => {
    return lines.some(
      (line) =>
        (line.from[0] === from[0] &&
          line.from[1] === from[1] &&
          line.to[0] === to[0] &&
          line.to[1] === to[1]) ||
        (line.from[0] === to[0] &&
          line.from[1] === to[1] &&
          line.to[0] === from[0] &&
          line.to[1] === from[1])
    );
  };

  const renderGrid = () => {
    const gridItems = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        gridItems.push(
          <div
            key={`dot-${row}-${col}`}
            className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
              myTurn ? "bg-white" : "bg-gray-500 pointer-events-none"
            }`}
            onClick={() => handleDotClick(row, col)}
          ></div>
        );

        if (col < GRID_SIZE - 1) {
          gridItems.push(
            <div
              key={`h-line-${row}-${col}`}
              className={`w-6 h-1 ${
                isLineDrawn({ from: [row, col], to: [row, col + 1] })
                  ? "bg-blue-500"
                  : "bg-transparent"
              }`}
            ></div>
          );
        }
      }

      if (row < GRID_SIZE - 1) {
        for (let col = 0; col < GRID_SIZE; col++) {
          gridItems.push(
            <div
              key={`v-line-${row}-${col}`}
              className={`h-6 w-1 ${
                isLineDrawn({ from: [row, col], to: [row + 1, col] })
                  ? "bg-blue-500"
                  : "bg-transparent"
              }`}
            ></div>
          );

          if (col < GRID_SIZE - 1) {
            gridItems.push(<div key={`spacer-${row}-${col}`} className="w-6 h-6"></div>);
          }
        }
      }
    }

    return gridItems;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Dot & Box Game</h1>
      {!myTurn && <div className="loader mb-4">Waiting for your turn...</div>}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE * 2 - 1}, auto)`,
        }}
      >
        {renderGrid()}
      </div>
      <div className="mt-6">
        <p>{player1} (Player 1) Score: {scores.player1}</p>
        <p>{player2} (Player 2) Score: {scores.player2}</p>
      </div>
    </div>
  );
}

export default GameScreen;