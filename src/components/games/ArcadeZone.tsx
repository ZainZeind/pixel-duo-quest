import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Bird, Blocks, Car } from "lucide-react";
import CoupleWingsGame from "./CoupleWingsGame";
import BrickBuilderGame from "./BrickBuilderGame";
import PixelRallyGame from "./PixelRallyGame";

interface ArcadeZoneProps {
  isOpen: boolean;
  onClose: () => void;
}

type GameType = null | "couple-wings" | "brick-builder" | "pixel-rally";

const ArcadeZone = ({ isOpen, onClose }: ArcadeZoneProps) => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const games = [
    {
      id: "couple-wings" as const,
      title: "COUPLE WINGS",
      description: "Tap to fly through pipes!",
      icon: Bird,
      color: "text-pink-400",
      bgColor: "bg-pink-400/20",
      borderColor: "border-pink-400",
    },
    {
      id: "brick-builder" as const,
      title: "BRICK BUILDER",
      description: "Fill rows to clear blocks!",
      icon: Blocks,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/20",
      borderColor: "border-cyan-400",
    },
    {
      id: "pixel-rally" as const,
      title: "PIXEL RALLY",
      description: "Dodge traffic on the road!",
      icon: Car,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
      borderColor: "border-green-400",
    },
  ];

  const handleBack = () => {
    setSelectedGame(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0a0a1a] flex flex-col"
      >
        {/* Header */}
        <header className="border-b-4 border-cyan-500 p-4 flex items-center justify-between bg-[#0d0d2b]">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <h1 className="font-pixel text-lg text-cyan-400">
              {selectedGame ? games.find(g => g.id === selectedGame)?.title : "ARCADE ZONE"}
            </h1>
          </div>
          <button
            onClick={selectedGame ? handleBack : onClose}
            className="pixel-btn text-[10px] px-3 py-2 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
          >
            {selectedGame ? "← BACK" : "✕ CLOSE"}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden p-4">
          <AnimatePresence mode="wait">
            {!selectedGame ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <p className="text-[10px] text-cyan-300 mb-8 text-center">
                  SELECT YOUR GAME
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
                  {games.map((game) => (
                    <motion.button
                      key={game.id}
                      onClick={() => setSelectedGame(game.id)}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${game.bgColor} ${game.borderColor} border-4 p-6 flex flex-col items-center gap-4 transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]`}
                    >
                      <game.icon className={`w-16 h-16 ${game.color}`} />
                      <h2 className={`font-pixel text-sm ${game.color}`}>
                        {game.title}
                      </h2>
                      <p className="text-[8px] text-gray-400 text-center">
                        {game.description}
                      </p>
                      <div className="text-[8px] text-yellow-400">
                        BEST: {localStorage.getItem(`${game.id}-highscore`) || 0}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Decorative stars */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-full flex items-center justify-center"
              >
                {selectedGame === "couple-wings" && <CoupleWingsGame />}
                {selectedGame === "brick-builder" && <BrickBuilderGame />}
                {selectedGame === "pixel-rally" && <PixelRallyGame />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArcadeZone;
