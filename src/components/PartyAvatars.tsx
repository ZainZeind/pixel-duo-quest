import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface PartyAvatarsProps {
  player1Name: string;
  player2Name: string;
  player1Avatar?: string;
  player2Avatar?: string;
}

const PartyAvatars = ({ player1Name, player2Name, player1Avatar, player2Avatar }: PartyAvatarsProps) => {
  // Check if avatar is male to apply scaling
  const isMaleAvatar = (avatar?: string) => avatar?.includes('char-male');
  
  return (
    <motion.div 
      className="flex items-end justify-center gap-4"
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
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={player1Avatar || "/char-male.png"} 
            alt={player1Name} 
            className={`object-contain ${isMaleAvatar(player1Avatar) ? 'w-16 h-16 scale-110' : 'w-14 h-14'}`}
          />
        </div>
        <span className="text-[8px] text-blue-400 mt-1">{player1Name}</span>
      </motion.div>

      {/* Heart between them */}
      <motion.div
        className="mb-6"
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
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={player2Avatar || "/char-female.png"} 
            alt={player2Name} 
            className={`object-contain ${isMaleAvatar(player2Avatar) ? 'w-16 h-16 scale-110' : 'w-14 h-14'}`}
          />
        </div>
        <span className="text-[8px] text-pink-400 mt-1">{player2Name}</span>
      </motion.div>
    </motion.div>
  );
};

export default PartyAvatars;
