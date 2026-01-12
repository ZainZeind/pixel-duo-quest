import { motion } from "framer-motion";
import { User, Users } from "lucide-react";

interface ModeToggleProps {
  isPartyMode: boolean;
  onToggle: () => void;
}

const ModeToggle = ({ isPartyMode, onToggle }: ModeToggleProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User className={`w-4 h-4 ${!isPartyMode ? 'text-personal' : 'text-muted-foreground'}`} />
        <span className={`text-[8px] uppercase ${!isPartyMode ? 'text-personal' : 'text-muted-foreground'}`}>
          Solo
        </span>
      </div>
      
      <button
        onClick={onToggle}
        className="relative w-20 h-8 bg-muted border-4 border-foreground cursor-pointer overflow-hidden"
        style={{
          boxShadow: 'inset 2px 2px 0 hsl(var(--pixel-shadow))'
        }}
      >
        <motion.div
          className={`absolute top-0 w-8 h-6 border-2 border-foreground ${
            isPartyMode ? 'bg-party' : 'bg-personal'
          }`}
          animate={{ left: isPartyMode ? 40 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        
        {/* Track markers */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <div className={`w-2 h-2 rounded-full ${!isPartyMode ? 'bg-personal' : 'bg-muted-foreground'}`} />
          <div className={`w-2 h-2 rounded-full ${isPartyMode ? 'bg-party' : 'bg-muted-foreground'}`} />
        </div>
      </button>
      
      <div className="flex items-center gap-2">
        <span className={`text-[8px] uppercase ${isPartyMode ? 'text-party' : 'text-muted-foreground'}`}>
          Party
        </span>
        <Users className={`w-4 h-4 ${isPartyMode ? 'text-party' : 'text-muted-foreground'}`} />
      </div>
    </div>
  );
};

export default ModeToggle;
