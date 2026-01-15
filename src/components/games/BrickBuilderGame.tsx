import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 8;
const CELL_SIZE = 40;

type BlockShape = number[][];

interface Block {
  id: number;
  shape: BlockShape;
  color: string;
}

const SHAPES: BlockShape[] = [
  [[1]], // 1x1
  [[1, 1]], // 1x2
  [[1], [1]], // 2x1
  [[1, 1, 1]], // 1x3
  [[1], [1], [1]], // 3x1
  [[1, 1], [1, 1]], // 2x2
  [[1, 1, 1], [1, 0, 0]], // L shape
  [[1, 0], [1, 0], [1, 1]], // J shape
  [[1, 1, 0], [0, 1, 1]], // S shape
  [[0, 1, 1], [1, 1, 0]], // Z shape
  [[1, 1, 1], [0, 1, 0]], // T shape
];

const COLORS = [
  "bg-cyan-400 border-cyan-300",
  "bg-pink-400 border-pink-300",
  "bg-yellow-400 border-yellow-300",
  "bg-green-400 border-green-300",
  "bg-purple-400 border-purple-300",
  "bg-orange-400 border-orange-300",
  "bg-red-400 border-red-300",
];

const BrickBuilderGame = () => {
  const [grid, setGrid] = useState<(string | null)[][]>(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ row: number; col: number } | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("brick-builder-highscore") || "0");
  });
  const [gameOver, setGameOver] = useState(false);

  const generateBlocks = useCallback(() => {
    const newBlocks: Block[] = [];
    for (let i = 0; i < 3; i++) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      newBlocks.push({ id: Date.now() + i, shape, color });
    }
    return newBlocks;
  }, []);

  useEffect(() => {
    setAvailableBlocks(generateBlocks());
  }, [generateBlocks]);

  const canPlaceBlock = useCallback((block: Block, row: number, col: number, currentGrid: (string | null)[][]) => {
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          const newRow = row + r;
          const newCol = col + c;
          if (
            newRow < 0 ||
            newRow >= GRID_SIZE ||
            newCol < 0 ||
            newCol >= GRID_SIZE ||
            currentGrid[newRow][newCol] !== null
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const checkGameOver = useCallback((blocks: Block[], currentGrid: (string | null)[][]) => {
    for (const block of blocks) {
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          if (canPlaceBlock(block, row, col, currentGrid)) {
            return false;
          }
        }
      }
    }
    return true;
  }, [canPlaceBlock]);

  const placeBlock = useCallback((block: Block, row: number, col: number) => {
    if (!canPlaceBlock(block, row, col, grid)) return;

    const newGrid = grid.map(r => [...r]);
    
    // Place the block
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          newGrid[row + r][col + c] = block.color;
        }
      }
    }

    // Check for completed rows and columns
    let linesCleared = 0;
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    // Check rows
    for (let r = 0; r < GRID_SIZE; r++) {
      if (newGrid[r].every(cell => cell !== null)) {
        rowsToClear.push(r);
      }
    }

    // Check columns
    for (let c = 0; c < GRID_SIZE; c++) {
      if (newGrid.every(row => row[c] !== null)) {
        colsToClear.push(c);
      }
    }

    // Clear rows
    for (const r of rowsToClear) {
      newGrid[r] = Array(GRID_SIZE).fill(null);
      linesCleared++;
    }

    // Clear columns
    for (const c of colsToClear) {
      for (let r = 0; r < GRID_SIZE; r++) {
        newGrid[r][c] = null;
      }
      linesCleared++;
    }

    setGrid(newGrid);

    // Calculate score
    const blockScore = block.shape.flat().filter(c => c === 1).length * 10;
    const lineBonus = linesCleared * 100;
    const newScore = score + blockScore + lineBonus;
    setScore(newScore);

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem("brick-builder-highscore", String(newScore));
    }

    // Remove used block and maybe generate new ones
    const newAvailable = availableBlocks.filter(b => b.id !== block.id);
    
    if (newAvailable.length === 0) {
      const freshBlocks = generateBlocks();
      setAvailableBlocks(freshBlocks);
      
      if (checkGameOver(freshBlocks, newGrid)) {
        setGameOver(true);
      }
    } else {
      setAvailableBlocks(newAvailable);
      
      if (checkGameOver(newAvailable, newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, score, highScore, availableBlocks, canPlaceBlock, checkGameOver, generateBlocks]);

  const resetGame = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    setAvailableBlocks(generateBlocks());
    setScore(0);
    setGameOver(false);
  };

  const handleDragStart = (block: Block) => {
    setDraggedBlock(block);
  };

  const handleDragEnd = () => {
    if (draggedBlock && hoverPosition) {
      placeBlock(draggedBlock, hoverPosition.row, hoverPosition.col);
    }
    setDraggedBlock(null);
    setHoverPosition(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (draggedBlock && canPlaceBlock(draggedBlock, row, col, grid)) {
      placeBlock(draggedBlock, row, col);
      setDraggedBlock(null);
    }
  };

  const handleBlockClick = (block: Block) => {
    if (draggedBlock?.id === block.id) {
      setDraggedBlock(null);
    } else {
      setDraggedBlock(block);
    }
  };

  const getPreviewCells = () => {
    if (!draggedBlock || !hoverPosition) return new Set<string>();
    const cells = new Set<string>();
    
    for (let r = 0; r < draggedBlock.shape.length; r++) {
      for (let c = 0; c < draggedBlock.shape[r].length; c++) {
        if (draggedBlock.shape[r][c] === 1) {
          const newRow = hoverPosition.row + r;
          const newCol = hoverPosition.col + c;
          if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
            cells.add(`${newRow}-${newCol}`);
          }
        }
      }
    }
    return cells;
  };

  const previewCells = getPreviewCells();
  const canPlace = draggedBlock && hoverPosition ? canPlaceBlock(draggedBlock, hoverPosition.row, hoverPosition.col, grid) : false;

  return (
    <div className="flex flex-col items-center">
      {/* Score Display */}
      <div className="flex gap-8 mb-4">
        <div className="text-center">
          <p className="text-[8px] text-gray-400">SCORE</p>
          <p className="font-pixel text-lg text-cyan-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] text-gray-400">BEST</p>
          <p className="font-pixel text-lg text-yellow-400">{highScore}</p>
        </div>
      </div>

      {/* Grid */}
      <div
        className="border-4 border-cyan-400 bg-[#0a0a1a] relative"
        style={{
          width: GRID_SIZE * CELL_SIZE + 8,
          height: GRID_SIZE * CELL_SIZE + 8,
          padding: 4,
        }}
      >
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPreview = previewCells.has(`${rowIndex}-${colIndex}`);
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    border border-cyan-900/50 transition-all cursor-pointer
                    ${cell ? `${cell} border-2` : "bg-[#0a0a2a]"}
                    ${isPreview && canPlace ? `${draggedBlock?.color} opacity-50` : ""}
                    ${isPreview && !canPlace ? "bg-red-500/30" : ""}
                  `}
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => draggedBlock && setHoverPosition({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoverPosition(null)}
                  whileHover={{ scale: draggedBlock ? 1.1 : 1 }}
                />
              );
            })
          )}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <p className="font-pixel text-lg text-red-400 mb-4">GAME OVER</p>
            <p className="font-pixel text-sm text-white mb-2">SCORE: {score}</p>
            <p className="font-pixel text-[10px] text-yellow-400 mb-6">BEST: {highScore}</p>
            <button
              onClick={resetGame}
              className="pixel-btn border-2 border-cyan-400 text-cyan-400 px-4 py-2 text-[10px] hover:bg-cyan-400/20"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Available Blocks */}
      <div className="mt-6">
        <p className="text-[8px] text-gray-400 text-center mb-3">
          {draggedBlock ? "CLICK ON GRID TO PLACE" : "SELECT A BLOCK"}
        </p>
        <div className="flex gap-4 justify-center">
          {availableBlocks.map((block) => (
            <motion.div
              key={block.id}
              className={`
                p-2 border-2 cursor-pointer transition-all
                ${draggedBlock?.id === block.id ? "border-white bg-white/10" : "border-gray-600 hover:border-gray-400"}
              `}
              onClick={() => handleBlockClick(block)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${block.shape[0].length}, 16px)` }}>
                {block.shape.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`w-4 h-4 ${cell ? `${block.color} border` : ""}`}
                    />
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls hint */}
      <p className="text-[8px] text-gray-400 mt-4">
        Click block to select, then click on grid to place
      </p>
    </div>
  );
};

export default BrickBuilderGame;
