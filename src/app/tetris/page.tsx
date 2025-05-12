"use client"; // Tambahkan directive ini di bagian atas file

import { useState, useEffect } from "react";

const ROWS = 20;
const COLS = 10;

// Tetromino shapes
const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
};

// Generate random Tetromino
const randomTetromino = () => {
  const tetrominos = Object.keys(TETROMINOS);
  const randomIndex = Math.floor(Math.random() * tetrominos.length);
  const tetrominoKey = tetrominos[randomIndex];
  return TETROMINOS[tetrominoKey];
};

export default function Tetris() {
  const [grid, setGrid] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentTetromino, setCurrentTetromino] = useState(randomTetromino());
  const [position, setPosition] = useState({
    row: 0,
    col: Math.floor(COLS / 2) - 1,
  });
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  // Check collision
  const checkCollision = (row: number, col: number, shape: number[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const newRow = row + r;
          const newCol = col + c;

          if (
            newRow >= ROWS || // Batas bawah
            newCol < 0 || // Batas kiri
            newCol >= COLS || // Batas kanan
            (newRow >= 0 && grid[newRow][newCol] === 1) // Tabrakan dengan blok lain
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Merge Tetromino into grid
  const mergeTetromino = () => {
    const newGrid = [...grid];
    currentTetromino.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 1) {
          const newRow = position.row + r;
          const newCol = position.col + c;
          if (newRow >= 0) {
            newGrid[newRow][newCol] = 1;
          }
        }
      });
    });
    setGrid(newGrid);
  };

  // Clear full rows
  const clearRows = () => {
    const newGrid = grid.filter((row) => row.some((cell) => cell === 0));
    const clearedRows = ROWS - newGrid.length;
    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(0));
    }
    setGrid(newGrid);
    return clearedRows;
  };

  // Rotate Tetromino
  const rotateTetromino = () => {
    const rotatedShape = currentTetromino.shape[0].map((_, colIndex) =>
      currentTetromino.shape.map((row) => row[colIndex]).reverse()
    );

    if (!checkCollision(position.row, position.col, rotatedShape)) {
      setCurrentTetromino((prev) => ({ ...prev, shape: rotatedShape }));
    }
  };

  // Calculate shadow position
  const calculateShadow = () => {
    let shadowRow = position.row;
    while (
      !checkCollision(shadowRow + 1, position.col, currentTetromino.shape)
    ) {
      shadowRow++;
    }
    return shadowRow;
  };

  // Drop Tetromino automatically
  useEffect(() => {
    if (gameOver || paused) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPosition = { ...prev, row: prev.row + 1 };

        if (checkCollision(newPosition.row, newPosition.col, currentTetromino.shape)) {
          mergeTetromino();
          clearRows();

          // Check for game over
          if (position.row === 0) {
            setGameOver(true);
            clearInterval(interval);
          } else {
            setCurrentTetromino(randomTetromino());
            setPosition({ row: 0, col: Math.floor(COLS / 2) - 1 });
          }

          return prev;
        }

        return newPosition;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [currentTetromino, position, grid, gameOver, paused]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;

      if (event.key === "ArrowLeft" && !paused) {
        const newPosition = { ...position, col: position.col - 1 };
        if (!checkCollision(newPosition.row, newPosition.col, currentTetromino.shape)) {
          setPosition(newPosition);
        }
      }
      if (event.key === "ArrowRight" && !paused) {
        const newPosition = { ...position, col: position.col + 1 };
        if (!checkCollision(newPosition.row, newPosition.col, currentTetromino.shape)) {
          setPosition(newPosition);
        }
      }
      if (event.key === "ArrowDown" && !paused) {
        const newPosition = { ...position, row: position.row + 1 };
        if (!checkCollision(newPosition.row, newPosition.col, currentTetromino.shape)) {
          setPosition(newPosition);
        }
      }
      if (event.key === "ArrowUp" && !paused) {
        rotateTetromino();
      }
      if (event.key === " ") {
        setPaused((prev) => !prev); // Toggle pause
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, currentTetromino, grid, gameOver, paused]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-800 relative"
    >
      {/* Tombol Back */}
      <a
        href="/"
        className="absolute top-4 right-4 bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition"
      >
        Back
      </a>

      {gameOver ? (
        <h1 className="text-4xl font-bold text-red-500">Game Over</h1>
      ) : paused ? (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-yellow-500 mb-4">Paused</h1>
          <button
            onClick={() => setPaused(false)}
            className="px-6 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            Resume
          </button>
          <a
            href="/"
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
          >
            Back
          </a>
        </div>
      ) : (
        <div className="grid grid-rows-20 grid-cols-10 border-2 border-gray-500 relative">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isTetromino =
                rowIndex >= position.row &&
                rowIndex < position.row + currentTetromino.shape.length &&
                colIndex >= position.col &&
                colIndex < position.col + currentTetromino.shape[0].length &&
                currentTetromino.shape[rowIndex - position.row][colIndex - position.col] === 1;

              const isShadow =
                rowIndex >= calculateShadow() &&
                rowIndex < calculateShadow() + currentTetromino.shape.length &&
                colIndex >= position.col &&
                colIndex < position.col + currentTetromino.shape[0].length &&
                currentTetromino.shape[rowIndex - calculateShadow()][colIndex - position.col] === 1;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-8 h-8 border border-gray-300 ${
                    isTetromino
                      ? "bg-blue-500"
                      : isShadow
                      ? "bg-blue-200"
                      : cell
                      ? "bg-blue-500 opacity-30"
                      : "bg-transparent"
                  }`}
                ></div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}