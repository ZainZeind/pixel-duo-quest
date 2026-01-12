import { motion } from "framer-motion";
import { Coins, Wallet, PiggyBank } from "lucide-react";
import RPGDialog from "./RPGDialog";

interface WalletDisplayProps {
  personalGold: number;
  treasuryGold?: number;
  isPartyMode: boolean;
}

const WalletDisplay = ({ personalGold, treasuryGold = 0, isPartyMode }: WalletDisplayProps) => {
  return (
    <RPGDialog variant={isPartyMode ? "party" : "personal"} title="Wallet">
      <div className="space-y-3">
        {/* Personal Gold */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gold" />
            <span className="text-[8px] text-muted-foreground uppercase">My Gold</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-3 h-3 text-gold" />
            <motion.span 
              key={personalGold}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-[10px] text-gold font-bold"
            >
              {personalGold.toLocaleString()}G
            </motion.span>
          </div>
        </motion.div>

        {/* Treasury (Party Mode) */}
        {isPartyMode && (
          <motion.div 
            className="flex items-center justify-between pt-2 border-t border-border"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-party" />
              <span className="text-[8px] text-muted-foreground uppercase">Treasury</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-3 h-3 text-party" />
              <motion.span 
                key={treasuryGold}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-[10px] text-party font-bold"
              >
                {treasuryGold.toLocaleString()}G
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>
    </RPGDialog>
  );
};

export default WalletDisplay;
