import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;
const LANE_COUNT = 3;
const LANE_WIDTH = GAME_WIDTH / LANE_COUNT;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 60;
const OBSTACLE_HEIGHT = 50;

interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: "car" | "rock";
}

const PixelRallyGame = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("pixel-rally-highscore") || "0");
  });
  const [speed, setSpeed] = useState(5);
  const [roadOffset, setRoadOffset] = useState(0);

  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const lastSpeedIncreaseRef = useRef(0);

  const startGame = () => {
    setGameState("playing");
    setPlayerLane(1);
    setObstacles([]);
    setScore(0);
    setSpeed(5);
    lastSpeedIncreaseRef.current = 0;
    obstacleIdRef.current = 0;
  };

  const moveLeft = useCallback(() => {
    if (gameState === "playing") {
      setPlayerLane((l) => Math.max(0, l - 1));
    }
  }, [gameState]);

  const moveRight = useCallback(() => {
    if (gameState === "playing") {
      setPlayerLane((l) => Math.min(2, l + 1));
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        moveLeft();
      } else if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        moveRight();
      } else if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "gameover") {
          startGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, moveLeft, moveRight]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      // Update road animation
      setRoadOffset((o) => (o + speed) % 40);

      // Update score
      setScore((s) => {
        const newScore = s + 1;
        
        // Speed increase every 500 points
        if (Math.floor(newScore / 500) > lastSpeedIncreaseRef.current) {
          lastSpeedIncreaseRef.current = Math.floor(newScore / 500);
          setSpeed((sp) => Math.min(sp + 1, 15));
        }
        
        return newScore;
      });

      // Update obstacles
      setObstacles((currentObstacles) => {
        let newObstacles = currentObstacles
          .map((obs) => ({ ...obs, y: obs.y + speed }))
          .filter((obs) => obs.y < GAME_HEIGHT + OBSTACLE_HEIGHT);

        // Add new obstacle
        if (
          newObstacles.length === 0 ||
          newObstacles[newObstacles.length - 1].y > 150
        ) {
          if (Math.random() < 0.3) {
            const lane = Math.floor(Math.random() * LANE_COUNT);
            newObstacles.push({
              id: obstacleIdRef.current++,
              lane,
              y: -OBSTACLE_HEIGHT,
              type: Math.random() < 0.7 ? "car" : "rock",
            });
          }
        }

        // Collision detection
        const playerX = playerLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
        const playerY = GAME_HEIGHT - CAR_HEIGHT - 20;

        for (const obs of newObstacles) {
          const obsX = obs.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
          const obsY = obs.y;

          // Simple AABB collision
          if (
            playerX < obsX + CAR_WIDTH &&
            playerX + CAR_WIDTH > obsX &&
            playerY < obsY + OBSTACLE_HEIGHT &&
            playerY + CAR_HEIGHT > obsY
          ) {
            setGameState("gameover");
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem("pixel-rally-highscore", String(score));
            }
            return newObstacles;
          }
        }

        return newObstacles;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, playerLane, speed, score, highScore]);

  const playerX = playerLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;

  return (
    <div className="flex flex-col items-center">
      {/* Game Canvas */}
      <div
        className="relative overflow-hidden border-4 border-green-400 select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Road Background */}
        <div className="absolute inset-0 bg-[#1a1a1a]">
          {/* Lane dividers */}
          {[1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-1"
              style={{ left: i * LANE_WIDTH - 2 }}
            >
              {[...Array(15)].map((_, j) => (
                <motion.div
                  key={j}
                  className="w-1 h-6 bg-yellow-400"
                  style={{
                    position: "absolute",
                    top: j * 40 + (roadOffset % 40) - 40,
                  }}
                />
              ))}
            </div>
          ))}

          {/* Road edges */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-green-600 to-green-500" />
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-green-600 to-green-500" />
        </div>

        {/* Obstacles */}
        {obstacles.map((obs) => (
          <motion.div
            key={obs.id}
            className="absolute"
            style={{
              left: obs.lane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2,
              top: obs.y,
              width: CAR_WIDTH,
              height: OBSTACLE_HEIGHT,
            }}
          >
            {obs.type === "car" ? (
              <div className="w-full h-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-red-300 flex flex-col items-center justify-between p-1">
                <div className="w-8 h-2 bg-blue-300 border border-blue-400" />
                <div className="w-full h-1 bg-red-400" />
                <div className="w-8 h-2 bg-yellow-300 border border-yellow-400" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🪨
              </div>
            )}
          </motion.div>
        ))}

        {/* Player Car */}
        <motion.div
          className="absolute"
          animate={{ left: playerX }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            top: GAME_HEIGHT - CAR_HEIGHT - 20,
            width: CAR_WIDTH,
            height: CAR_HEIGHT,
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-cyan-400 to-cyan-600 border-2 border-cyan-300 flex flex-col items-center justify-between p-1">
            <div className="w-8 h-2 bg-white/50 border border-white/70" />
            <div className="w-full h-1 bg-cyan-300" />
            <div className="w-8 h-2 bg-red-400 border border-red-300" />
          </div>
        </motion.div>

        {/* Score */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="font-pixel text-sm text-white drop-shadow-lg">
            {score}
          </div>
          <div className="font-pixel text-[8px] text-yellow-400">
            SPD: {speed}
          </div>
        </div>

        {/* Idle Screen */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <div className="text-4xl mb-4">🏎️</div>
            <p className="font-pixel text-sm text-white mb-2">PIXEL RALLY</p>
            <p className="text-[8px] text-green-300 animate-pulse">
              PRESS SPACE TO START
            </p>
            <p className="text-[8px] text-gray-400 mt-4">
              ← → ARROWS TO MOVE
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <p className="font-pixel text-lg text-red-400 mb-4">CRASH!</p>
            <p className="font-pixel text-sm text-white mb-2">
              DISTANCE: {score}m
            </p>
            <p className="font-pixel text-[10px] text-yellow-400 mb-6">
              BEST: {highScore}m
            </p>
            <button
              onClick={startGame}
              className="pixel-btn border-2 border-green-400 text-green-400 px-4 py-2 text-[10px] hover:bg-green-400/20"
            >
              RETRY
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={moveLeft}
          className="pixel-btn border-2 border-green-400 text-green-400 px-6 py-3 text-lg active:bg-green-400/20"
        >
          ←
        </button>
        <button
          onClick={moveRight}
          className="pixel-btn border-2 border-green-400 text-green-400 px-6 py-3 text-lg active:bg-green-400/20"
        >
          →
        </button>
      </div>

      {/* Controls hint */}
      <p className="text-[8px] text-gray-400 mt-2">
        ← → ARROW KEYS or TAP BUTTONS
      </p>
    </div>
  );
};

export default PixelRallyGame;
