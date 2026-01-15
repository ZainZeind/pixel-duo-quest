import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 24;
const INITIAL_SPEED = 1000;
const SPEED_INCREASE = 50;
const MIN_SPEED = 100;

// Tetromino shapes
const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-400 border-cyan-300" },
  O: { shape: [[1, 1], [1, 1]], color: "bg-yellow-400 border-yellow-300" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "bg-purple-400 border-purple-300" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "bg-green-400 border-green-300" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "bg-red-400 border-red-300" },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: "bg-blue-400 border-blue-300" },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: "bg-orange-400 border-orange-300" },
};

type TetrominoType = keyof typeof TETROMINOES;
type Board = (string | null)[][];

interface Piece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const BrickBuilderGame = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "gameover">("idle");
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("block-blast-highscore") || "0");
  });

  const gameLoopRef = useRef<number>();
  const lastDropRef = useRef<number>(0);
  const speedRef = useRef(INITIAL_SPEED);

  function createEmptyBoard(): Board {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
  }

  function getRandomTetromino(): TetrominoType {
    const types = Object.keys(TETROMINOES) as TetrominoType[];
    return types[Math.floor(Math.random() * types.length)];
  }

  function createPiece(type: TetrominoType): Piece {
    const tetro = TETROMINOES[type];
    return {
      type,
      shape: tetro.shape.map(row => [...row]),
      x: Math.floor((BOARD_WIDTH - tetro.shape[0].length) / 2),
      y: 0,
      color: tetro.color,
    };
  }

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const newShape = piece.shape[0].map((_, colIndex) =>
      piece.shape.map(row => row[colIndex]).reverse()
    );
    return { ...piece, shape: newShape };
  }, []);

  const isValidPosition = useCallback((piece: Piece, boardState: Board): boolean => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newX = piece.x + col;
          const newY = piece.y + row;

          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }

          if (newY >= 0 && boardState[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const lockPiece = useCallback((piece: Piece, boardState: Board): Board => {
    const newBoard = boardState.map(row => [...row]);
    
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newY = piece.y + row;
          const newX = piece.x + col;
          if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
            newBoard[newY][newX] = piece.color;
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  const clearLines = useCallback((boardState: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = boardState.filter(row => row.some(cell => !cell));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newBoard, linesCleared };
  }, []);

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setLines(0);
    speedRef.current = INITIAL_SPEED;
    
    const firstType = getRandomTetromino();
    const secondType = getRandomTetromino();
    
    setCurrentPiece(createPiece(firstType));
    setNextPiece(secondType);
    setGameState("playing");
  }, []);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameState !== "playing") return;

    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };

    if (isValidPosition(newPiece, board)) {
      setCurrentPiece(newPiece);
      return true;
    } else if (dy > 0) {
      // Lock piece when can't move down
      const newBoard = lockPiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] * level;
        setScore(s => s + points);
        setLines(l => {
          const newLines = l + linesCleared;
          if (Math.floor(newLines / 10) > Math.floor(l / 10)) {
            setLevel(lv => lv + 1);
            speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREASE);
          }
          return newLines;
        });
      }
      
      // Spawn new piece
      if (nextPiece) {
        const newPiece = createPiece(nextPiece);
        if (!isValidPosition(newPiece, clearedBoard)) {
          // Game over
          setGameState("gameover");
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("block-blast-highscore", String(score));
          }
          return false;
        }
        setCurrentPiece(newPiece);
        setNextPiece(getRandomTetromino());
      }
      return false;
    }
    return false;
  }, [currentPiece, board, gameState, isValidPosition, lockPiece, clearLines, nextPiece, level, score, highScore]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    
    let piece = { ...currentPiece };
    while (isValidPosition({ ...piece, y: piece.y + 1 }, board)) {
      piece.y++;
    }
    setCurrentPiece(piece);
    
    // Force immediate lock
    setTimeout(() => movePiece(0, 1), 0);
  }, [currentPiece, gameState, board, isValidPosition, movePiece]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameState !== "playing") return;
    
    const rotated = rotatePiece(currentPiece);
    
    // Try wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      const kicked = { ...rotated, x: rotated.x + kick };
      if (isValidPosition(kicked, board)) {
        setCurrentPiece(kicked);
        return;
      }
    }
  }, [currentPiece, gameState, rotatePiece, isValidPosition, board]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") {
        if (e.code === "Space" && gameState === "idle") {
          startGame();
        }
        return;
      }

      switch (e.code) {
        case "ArrowLeft":
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case "ArrowRight":
          e.preventDefault();
          movePiece(1, 0);
          break;
        case "ArrowDown":
          e.preventDefault();
          movePiece(0, 1);
          break;
        case "ArrowUp":
        case "KeyX":
          e.preventDefault();
          rotate();
          break;
        case "Space":
          e.preventDefault();
          hardDrop();
          break;
        case "KeyP":
          setGameState(s => s === "playing" ? "paused" : "playing");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, movePiece, rotate, hardDrop, startGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastDropRef.current >= speedRef.current) {
        movePiece(0, 1);
        lastDropRef.current = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    lastDropRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, movePiece]);

  // Render ghost piece (preview where piece will land)
  const getGhostPosition = useCallback(() => {
    if (!currentPiece) return null;
    
    let ghostY = currentPiece.y;
    while (isValidPosition({ ...currentPiece, y: ghostY + 1 }, board)) {
      ghostY++;
    }
    return ghostY;
  }, [currentPiece, board, isValidPosition]);

  const renderBoard = () => {
    const ghostY = getGhostPosition();
    
    return (
      <div 
        className="relative border-4 border-primary bg-slate-900"
        style={{ 
          width: BOARD_WIDTH * CELL_SIZE + 8, 
          height: BOARD_HEIGHT * CELL_SIZE + 8 
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-1 grid" style={{ 
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${CELL_SIZE}px)`,
        }}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`border border-slate-800 ${cell || ''}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))
          )}
        </div>

        {/* Ghost piece */}
        {currentPiece && ghostY !== null && ghostY !== currentPiece.y && (
          <div className="absolute top-1 left-1">
            {currentPiece.shape.map((row, y) =>
              row.map((cell, x) =>
                cell ? (
                  <div
                    key={`ghost-${y}-${x}`}
                    className="absolute border-2 border-dashed border-white/30"
                    style={{
                      left: (currentPiece.x + x) * CELL_SIZE,
                      top: (ghostY + y) * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                ) : null
              )
            )}
          </div>
        )}

        {/* Current piece */}
        {currentPiece && (
          <div className="absolute top-1 left-1">
            {currentPiece.shape.map((row, y) =>
              row.map((cell, x) =>
                cell ? (
                  <motion.div
                    key={`piece-${y}-${x}`}
                    className={`absolute ${currentPiece.color} border-2`}
                    style={{
                      left: (currentPiece.x + x) * CELL_SIZE,
                      top: (currentPiece.y + y) * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  />
                ) : null
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    const tetro = TETROMINOES[nextPiece];
    
    return (
      <div className="bg-slate-800 p-2 border-2 border-border">
        <p className="text-[8px] text-muted-foreground mb-2">NEXT</p>
        <div className="grid gap-0.5" style={{ 
          gridTemplateColumns: `repeat(${tetro.shape[0].length}, 16px)` 
        }}>
          {tetro.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`next-${y}-${x}`}
                className={`w-4 h-4 ${cell ? tetro.color + ' border' : 'bg-transparent'}`}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4">
        {/* Main game board */}
        <div className="relative">
          {renderBoard()}

          {/* Idle overlay */}
          {gameState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <p className="font-pixel text-lg text-primary mb-4">BLOCK BLAST</p>
              <p className="text-[10px] text-muted-foreground mb-6">Tetris-style puzzle!</p>
              <button
                onClick={startGame}
                className="pixel-btn border-2 border-primary text-primary px-4 py-2 text-[10px] hover:bg-primary/20"
              >
                START GAME
              </button>
              <p className="text-[8px] text-muted-foreground mt-4">or press SPACE</p>
            </div>
          )}

          {/* Paused overlay */}
          {gameState === "paused" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <p className="font-pixel text-lg text-yellow-400 mb-4">PAUSED</p>
              <p className="text-[8px] text-muted-foreground">Press P to continue</p>
            </div>
          )}

          {/* Game over overlay */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <p className="font-pixel text-lg text-red-400 mb-4">GAME OVER</p>
              <p className="font-pixel text-sm text-white mb-2">SCORE: {score}</p>
              <p className="font-pixel text-[10px] text-yellow-400 mb-6">BEST: {highScore}</p>
              <button
                onClick={startGame}
                className="pixel-btn border-2 border-primary text-primary px-4 py-2 text-[10px] hover:bg-primary/20"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          {renderNextPiece()}
          
          <div className="bg-slate-800 p-2 border-2 border-border">
            <p className="text-[8px] text-muted-foreground">SCORE</p>
            <p className="font-pixel text-sm text-primary">{score}</p>
          </div>
          
          <div className="bg-slate-800 p-2 border-2 border-border">
            <p className="text-[8px] text-muted-foreground">LEVEL</p>
            <p className="font-pixel text-sm text-secondary">{level}</p>
          </div>
          
          <div className="bg-slate-800 p-2 border-2 border-border">
            <p className="text-[8px] text-muted-foreground">LINES</p>
            <p className="font-pixel text-sm text-gold">{lines}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 text-center">
        <p className="text-[8px] text-muted-foreground">
          ← → Move • ↓ Soft Drop • ↑ Rotate • SPACE Hard Drop • P Pause
        </p>
        
        {/* Touch controls for mobile */}
        {gameState === "playing" && (
          <div className="flex gap-2 mt-3 justify-center">
            <button 
              onClick={() => movePiece(-1, 0)}
              className="w-10 h-10 bg-slate-700 border-2 border-slate-600 text-white text-lg active:bg-slate-600"
            >
              ←
            </button>
            <button 
              onClick={() => rotate()}
              className="w-10 h-10 bg-slate-700 border-2 border-slate-600 text-white text-lg active:bg-slate-600"
            >
              ↻
            </button>
            <button 
              onClick={() => movePiece(1, 0)}
              className="w-10 h-10 bg-slate-700 border-2 border-slate-600 text-white text-lg active:bg-slate-600"
            >
              →
            </button>
            <button 
              onClick={() => movePiece(0, 1)}
              className="w-10 h-10 bg-slate-700 border-2 border-slate-600 text-white text-lg active:bg-slate-600"
            >
              ↓
            </button>
            <button 
              onClick={hardDrop}
              className="w-10 h-10 bg-primary/50 border-2 border-primary text-white text-lg active:bg-primary/70"
            >
              ⬇
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrickBuilderGame;
