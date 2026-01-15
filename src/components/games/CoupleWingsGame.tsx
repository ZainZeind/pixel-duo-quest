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
const BIRD_SIZE = 32;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
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
  const birdRef = useRef({ y: GAME_HEIGHT / 2, velocity: 0 });

  // Immediate jump with no delay
  const jump = useCallback(() => {
    if (gameState === "idle") {
      setGameState("playing");
      birdRef.current.velocity = JUMP_FORCE;
      setBirdVelocity(JUMP_FORCE);
    } else if (gameState === "playing") {
      birdRef.current.velocity = JUMP_FORCE;
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameState]);

  const resetGame = () => {
    birdRef.current = { y: GAME_HEIGHT / 2, velocity: 0 };
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    pipeIdRef.current = 0;
    setGameState("idle");
  };

  // Keyboard controls - immediate response
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

  // Touch/click controls - immediate with pointer events
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (gameState === "gameover") {
      resetGame();
    } else {
      jump();
    }
  }, [gameState, jump]);

  // Game loop using refs for immediate response
  useEffect(() => {
    if (gameState !== "playing") return;

    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
      lastTime = currentTime;

      // Update bird physics using refs (immediate)
      birdRef.current.velocity += GRAVITY * deltaTime;
      birdRef.current.y += birdRef.current.velocity * deltaTime;
      
      const newY = birdRef.current.y;
      
      // Check floor/ceiling collision
      if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
        setGameState("gameover");
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("couple-wings-highscore", String(score));
        }
        return;
      }
      
      setBirdY(newY);
      setBirdVelocity(birdRef.current.velocity);

      // Update pipes
      setPipes((currentPipes) => {
        let newPipes = currentPipes
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED * deltaTime }))
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
          const birdTop = birdRef.current.y;
          const birdBottom = birdRef.current.y + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
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
  }, [gameState, score, highScore]);

  // Pixel Bird Component
  const PixelBird = ({ rotation }: { rotation: number }) => (
    <div 
      className="relative"
      style={{ 
        width: BIRD_SIZE, 
        height: BIRD_SIZE,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Body */}
      <div className="absolute bg-yellow-400" style={{ width: 20, height: 16, top: 8, left: 6 }} />
      {/* Head */}
      <div className="absolute bg-yellow-300" style={{ width: 14, height: 12, top: 4, left: 14 }} />
      {/* Eye */}
      <div className="absolute bg-white" style={{ width: 6, height: 6, top: 6, left: 18 }} />
      <div className="absolute bg-black" style={{ width: 3, height: 3, top: 7, left: 20 }} />
      {/* Beak */}
      <div className="absolute bg-orange-500" style={{ width: 8, height: 4, top: 10, left: 26 }} />
      {/* Wing */}
      <div 
        className="absolute bg-yellow-500"
        style={{ 
          width: 10, 
          height: 8, 
          top: birdVelocity < 0 ? 4 : 14, 
          left: 4,
          transition: 'top 0.05s'
        }} 
      />
      {/* Tail */}
      <div className="absolute bg-orange-400" style={{ width: 6, height: 8, top: 10, left: 0 }} />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {/* Game Canvas */}
      <div
        className="relative overflow-hidden border-4 border-primary cursor-pointer select-none touch-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
          {/* Clouds */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/80 rounded-full"
              style={{
                width: 40 + i * 10,
                height: 20 + i * 5,
                top: `${10 + i * 15}%`,
              }}
              animate={{ x: [-100, GAME_WIDTH + 100] }}
              transition={{ 
                duration: 15 + i * 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2 
              }}
            />
          ))}
        </div>

        {/* Pipes */}
        {pipes.map((pipe) => (
          <div key={pipe.id}>
            {/* Top pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-400 border-2 border-green-700"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.gapY,
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-green-500 border-2 border-green-700 -mx-1" style={{ width: PIPE_WIDTH + 8, left: -4 }} />
            </div>
            {/* Bottom pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-400 border-2 border-green-700"
              style={{
                left: pipe.x,
                top: pipe.gapY + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.gapY - PIPE_GAP,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-6 bg-green-500 border-2 border-green-700 -mx-1" style={{ width: PIPE_WIDTH + 8, left: -4 }} />
            </div>
          </div>
        ))}

        {/* Bird */}
        <div
          className="absolute"
          style={{
            left: GAME_WIDTH / 4 - BIRD_SIZE / 2,
            top: birdY,
          }}
        >
          <PixelBird rotation={Math.min(Math.max(birdVelocity * 3, -30), 60)} />
        </div>

        {/* Score */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 font-pixel text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {score}
        </div>

        {/* Idle Screen */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="mb-4"
            >
              <PixelBird rotation={0} />
            </motion.div>
            <p className="font-pixel text-sm text-white mb-2">FLAPPY COUPLE</p>
            <p className="text-[10px] text-yellow-300 animate-pulse">
              TAP OR SPACE TO FLY
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
              className="pixel-btn border-2 border-yellow-400 text-yellow-400 px-4 py-2 text-[10px] hover:bg-yellow-400/20"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-green-700 via-green-600 to-green-700 border-t-2 border-green-800" />
      </div>

      {/* Controls hint */}
      <p className="text-[8px] text-gray-400 mt-4">
        SPACE / TAP to fly • Instant response!
      </p>
    </div>
  );
};

export default CoupleWingsGame;
