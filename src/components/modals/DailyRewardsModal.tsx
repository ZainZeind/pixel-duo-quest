import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, Sparkles, Star, Flame, Calendar, X, RotateCcw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  lastClaimDate?: string;
  onClaimReward: (reward: { gold: number; xp: number }) => void;
  onSpinWheel: () => void;
}

const weeklyRewards = [
  { day: 1, gold: 10, xp: 5 },
  { day: 2, gold: 20, xp: 10 },
  { day: 3, gold: 30, xp: 15 },
  { day: 4, gold: 50, xp: 25 },
  { day: 5, gold: 75, xp: 35 },
  { day: 6, gold: 100, xp: 50 },
  { day: 7, gold: 200, xp: 100, bonus: '🎁 Mystery Box!' },
];

const wheelPrizes = [
  { label: '10G', gold: 10, color: '#FFD700' },
  { label: '25G', gold: 25, color: '#FF6B6B' },
  { label: '50G', gold: 50, color: '#4ECDC4' },
  { label: '5XP', xp: 5, color: '#45B7D1' },
  { label: '15XP', xp: 15, color: '#96CEB4' },
  { label: '100G!', gold: 100, color: '#DDA0DD' },
  { label: '50XP!', xp: 50, color: '#F7DC6F' },
  { label: '2x', multiplier: 2, color: '#BB8FCE' },
];

const DailyRewardsModal = ({ 
  isOpen, 
  onClose, 
  currentStreak, 
  lastClaimDate,
  onClaimReward,
  onSpinWheel
}: DailyRewardsModalProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<typeof wheelPrizes[0] | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (lastClaimDate) {
      const today = new Date().toDateString();
      const lastClaim = new Date(lastClaimDate).toDateString();
      setCanClaim(today !== lastClaim);
      setClaimed(today === lastClaim);
    } else {
      setCanClaim(true);
    }
  }, [lastClaimDate, isOpen]);

  const handleClaim = () => {
    const dayIndex = Math.min(currentStreak, 6);
    const reward = weeklyRewards[dayIndex];
    onClaimReward({ gold: reward.gold, xp: reward.xp });
    setClaimed(true);
    setCanClaim(false);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSpinResult(null);
    
    // Random prize
    const prizeIndex = Math.floor(Math.random() * wheelPrizes.length);
    const prize = wheelPrizes[prizeIndex];
    
    // Calculate rotation (5 full spins + landing on prize)
    const segmentAngle = 360 / wheelPrizes.length;
    const rotation = 360 * 5 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);
    
    setSpinRotation(prev => prev + rotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);
      onSpinWheel();
      
      // Apply reward
      if (prize.gold) {
        onClaimReward({ gold: prize.gold, xp: 0 });
      } else if (prize.xp) {
        onClaimReward({ gold: 0, xp: prize.xp });
      }
    }, 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-gold p-0 max-w-md shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-gold flex flex-row items-center justify-between">
          <DialogTitle className="text-gold text-sm flex items-center gap-2">
            <Gift className="w-4 h-4" />
            DAILY REWARDS
          </DialogTitle>
          <div className="flex items-center gap-2 text-[10px]">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-orange-500">{currentStreak} Day Streak!</span>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-6">
          {/* Weekly Calendar */}
          <div>
            <h3 className="text-[10px] text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Weekly Rewards
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {weeklyRewards.map((reward, i) => {
                const isPast = i < currentStreak;
                const isToday = i === currentStreak;
                const isFuture = i > currentStreak;
                
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className={`p-2 border-2 text-center transition-all ${
                      isPast 
                        ? 'border-gold bg-gold/20' 
                        : isToday 
                          ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                          : 'border-border opacity-50'
                    }`}
                  >
                    <div className="text-[8px] text-muted-foreground mb-1">Day {reward.day}</div>
                    <div className="text-sm mb-1">
                      {isPast ? '✓' : isToday ? '🎁' : '🔒'}
                    </div>
                    <div className="text-[7px] text-gold">{reward.gold}G</div>
                    {reward.bonus && isToday && (
                      <div className="text-[6px] text-secondary mt-1">{reward.bonus}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Claim Button */}
          <motion.button
            onClick={handleClaim}
            disabled={!canClaim || claimed}
            whileHover={canClaim && !claimed ? { scale: 1.02 } : {}}
            whileTap={canClaim && !claimed ? { scale: 0.98 } : {}}
            className={`w-full py-3 border-4 text-[12px] transition-all ${
              canClaim && !claimed
                ? 'border-gold bg-gold/20 text-gold hover:bg-gold/30'
                : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {claimed ? '✓ CLAIMED TODAY!' : canClaim ? 'CLAIM DAILY REWARD' : 'ALREADY CLAIMED'}
          </motion.button>

          {/* Spin Wheel */}
          <div className="border-t-2 border-border pt-4">
            <h3 className="text-[10px] text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Lucky Spin (Once Daily)
            </h3>
            
            <div className="relative flex flex-col items-center">
              {/* Wheel */}
              <div className="relative w-48 h-48">
                {/* Arrow indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-gold" />
                </div>
                
                {/* Wheel */}
                <motion.div
                  className="w-full h-full rounded-full border-4 border-gold overflow-hidden relative"
                  animate={{ rotate: spinRotation }}
                  transition={{ duration: 4, ease: "easeOut" }}
                >
                  {wheelPrizes.map((prize, i) => {
                    const angle = (360 / wheelPrizes.length) * i;
                    return (
                      <div
                        key={i}
                        className="absolute w-1/2 h-1/2 origin-bottom-right"
                        style={{
                          transform: `rotate(${angle}deg)`,
                          backgroundColor: prize.color,
                          clipPath: 'polygon(100% 100%, 0% 100%, 100% 0%)',
                        }}
                      >
                        <span 
                          className="absolute text-[8px] text-background font-bold"
                          style={{
                            transform: `rotate(${45}deg)`,
                            top: '30%',
                            left: '50%',
                          }}
                        >
                          {prize.label}
                        </span>
                      </div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-background border-4 border-gold flex items-center justify-center">
                      <Star className="w-6 h-6 text-gold" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Spin Button */}
              <motion.button
                onClick={handleSpin}
                disabled={isSpinning}
                whileHover={!isSpinning ? { scale: 1.05 } : {}}
                whileTap={!isSpinning ? { scale: 0.95 } : {}}
                className={`mt-4 px-6 py-2 border-4 text-[10px] flex items-center gap-2 ${
                  isSpinning 
                    ? 'border-border bg-muted text-muted-foreground' 
                    : 'border-primary bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'SPINNING...' : 'SPIN!'}
              </motion.button>

              {/* Result */}
              <AnimatePresence>
                {spinResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 border-2 border-gold bg-gold/10 text-center"
                  >
                    <Sparkles className="w-6 h-6 text-gold mx-auto mb-2" />
                    <p className="text-gold text-sm">You won {spinResult.label}!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyRewardsModal;
