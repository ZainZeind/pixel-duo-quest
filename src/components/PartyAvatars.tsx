import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface PartyAvatarsProps {
  player1Name: string;
  player2Name: string;
}

const PartyAvatars = ({ player1Name, player2Name }: PartyAvatarsProps) => {
  // Simple 8x8 pixel art patterns as CSS
  const renderPixelCharacter = (isPlayer1: boolean) => {
    const hairColor = isPlayer1 ? "#8B4513" : "#2D1B0E";
    const skinColor = "#FDBF6F";
    const shirtColor = isPlayer1 ? "#3B82F6" : "#EC4899";
    
    return (
      <div className="w-16 h-20 relative">
        {/* Hair */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-4"
          style={{ backgroundColor: hairColor }}
        />
        {/* Head */}
        <div 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-6"
          style={{ backgroundColor: skinColor }}
        />
        {/* Eyes */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-1 h-1 bg-foreground" />
          <div className="w-1 h-1 bg-foreground" />
        </div>
        {/* Body */}
        <div 
          className="absolute top-9 left-1/2 -translate-x-1/2 w-10 h-8"
          style={{ backgroundColor: shirtColor }}
        />
        {/* Legs */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
          <div className="w-3 h-3 bg-muted" />
          <div className="w-3 h-3 bg-muted" />
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="flex items-end justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Player 1 */}
      <motion.div 
        className="flex flex-col items-center"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {renderPixelCharacter(true)}
        <span className="text-[8px] text-personal mt-1">{player1Name}</span>
      </motion.div>

      {/* Heart between them */}
      <motion.div
        className="mb-8"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Heart className="w-6 h-6 text-heart fill-heart" />
      </motion.div>

      {/* Player 2 */}
      <motion.div 
        className="flex flex-col items-center"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        {renderPixelCharacter(false)}
        <span className="text-[8px] text-party mt-1">{player2Name}</span>
      </motion.div>
    </motion.div>
  );
};

export default PartyAvatars;
