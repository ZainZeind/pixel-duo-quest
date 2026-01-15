import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface Pipe {
  id: number;
  x: number;
  gapY: number;
  passed: boolean;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_SPEED = 3;

const CoupleWingsGame = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("couple-wings-highscore") || "0");
  });
  
  const gameLoopRef = useRef<number>();
  const pipeIdRef = useRef(0);

  const jump = useCallback(() => {
    if (gameState === "idle") {
      setGameState("playing");
      setBirdVelocity(JUMP_FORCE);
    } else if (gameState === "playing") {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameState]);

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    pipeIdRef.current = 0;
    setGameState("idle");
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (gameState === "gameover") {
          resetGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      // Update bird
      setBirdVelocity((v) => v + GRAVITY);
      setBirdY((y) => {
        const newY = y + birdVelocity;
        
        // Check floor/ceiling collision
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameState("gameover");
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("couple-wings-highscore", String(score));
          }
          return y;
        }
        return newY;
      });

      // Update pipes
      setPipes((currentPipes) => {
        let newPipes = currentPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
          newPipes.push({
            id: pipeIdRef.current++,
            x: GAME_WIDTH,
            gapY: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
            passed: false,
          });
        }

        // Check scoring and collision
        newPipes = newPipes.map((pipe) => {
          // Scoring
          if (!pipe.passed && pipe.x + PIPE_WIDTH < GAME_WIDTH / 4) {
            setScore((s) => s + 1);
            return { ...pipe, passed: true };
          }

          // Collision detection
          const birdLeft = GAME_WIDTH / 4 - BIRD_SIZE / 2;
          const birdRight = birdLeft + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Bird is within pipe x range
            if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
              // Collision!
              setGameState("gameover");
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("couple-wings-highscore", String(score));
              }
            }
          }

          return pipe;
        });

        return newPipes;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, birdVelocity, birdY, score, highScore]);

  return (
    <div className="flex flex-col items-center">
      {/* Game Canvas */}
      <div
        className="relative overflow-hidden border-4 border-pink-400 cursor-pointer select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={() => gameState === "gameover" ? resetGame() : jump()}
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#16213e] to-[#0f3460]">
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 7) % 40}%`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          
          {/* Moving clouds */}
          <motion.div
            className="absolute w-20 h-8 bg-pink-300/20 rounded-full"
            style={{ top: "20%" }}
            animate={{ x: [-100, GAME_WIDTH + 100] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-16 h-6 bg-pink-300/10 rounded-full"
            style={{ top: "40%" }}
            animate={{ x: [-80, GAME_WIDTH + 80] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
          />
        </div>

        {/* Pipes */}
        {pipes.map((pipe) => (
          <div key={pipe.id}>
            {/* Top pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-400 border-2 border-green-300"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.gapY,
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-500 border-t-2 border-green-300" />
            </div>
            {/* Bottom pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-400 border-2 border-green-300"
              style={{
                left: pipe.x,
                top: pipe.gapY + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.gapY - PIPE_GAP,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-4 bg-green-500 border-b-2 border-green-300" />
            </div>
          </div>
        ))}

        {/* Bird (Heart sprite) */}
        <motion.div
          className="absolute text-3xl"
          style={{
            left: GAME_WIDTH / 4 - BIRD_SIZE / 2,
            top: birdY,
            transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
          }}
        >
          💕
        </motion.div>

        {/* Score */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-pixel text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {score}
        </div>

        {/* Idle Screen */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              💕
            </motion.div>
            <p className="font-pixel text-sm text-white mb-2">COUPLE WINGS</p>
            <p className="text-[8px] text-pink-300 animate-pulse">
              TAP OR SPACE TO START
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <p className="font-pixel text-lg text-red-400 mb-4">GAME OVER</p>
            <p className="font-pixel text-sm text-white mb-2">SCORE: {score}</p>
            <p className="font-pixel text-[10px] text-yellow-400 mb-6">
              BEST: {highScore}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              className="pixel-btn border-2 border-pink-400 text-pink-400 px-4 py-2 text-[10px] hover:bg-pink-400/20"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600" />
      </div>

      {/* Controls hint */}
      <p className="text-[8px] text-gray-400 mt-4">
        SPACE / TAP to jump
      </p>
    </div>
  );
};

export default CoupleWingsGame;
