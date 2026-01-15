import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Lock, Star, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACHIEVEMENTS, getAchievementsByCategory } from "@/lib/achievements";
import { Achievement, AchievementCategory } from "@/types";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
  progress: Record<string, number>;
}

const categoryInfo: Record<AchievementCategory, { icon: string; label: string }> = {
  relationship: { icon: "💕", label: "Relationship" },
  quests: { icon: "⚔️", label: "Quests" },
  financial: { icon: "💰", label: "Financial" },
  games: { icon: "🎮", label: "Games" },
  pets: { icon: "🐱", label: "Pets" },
  social: { icon: "✨", label: "Social" },
};

const AchievementsModal = ({ isOpen, onClose, unlockedIds, progress }: AchievementsModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>("relationship");

  const totalAchievements = ACHIEVEMENTS.length;
  const totalUnlocked = unlockedIds.length;

  const renderAchievement = (achievement: Achievement) => {
    const isUnlocked = unlockedIds.includes(achievement.id);
    const currentProgress = progress[achievement.id] || 0;
    const progressPercent = Math.min((currentProgress / achievement.requirement) * 100, 100);

    return (
      <motion.div
        key={achievement.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative p-3 border-2 transition-all ${
          isUnlocked
            ? "border-gold bg-gold/10"
            : "border-border bg-muted/30 opacity-70"
        }`}
      >
        {/* Icon */}
        <div className="flex items-start gap-3">
          <div className={`text-2xl ${!isUnlocked && "grayscale opacity-50"}`}>
            {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-[10px] font-medium ${isUnlocked ? "text-gold" : "text-foreground"}`}>
              {achievement.name}
            </h3>
            <p className="text-[8px] text-muted-foreground mt-0.5">
              {achievement.description}
            </p>
            
            {/* Progress bar */}
            {!isUnlocked && (
              <div className="mt-2">
                <div className="h-1.5 bg-background border border-border overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-[6px] text-muted-foreground">
                  {currentProgress}/{achievement.requirement}
                </span>
              </div>
            )}
            
            {/* Rewards */}
            <div className="flex items-center gap-2 mt-2 text-[7px]">
              {achievement.reward.xp && (
                <span className="flex items-center gap-0.5 text-xp">
                  <Star className="w-2.5 h-2.5" /> {achievement.reward.xp} XP
                </span>
              )}
              {achievement.reward.gold && (
                <span className="flex items-center gap-0.5 text-gold">
                  💰 {achievement.reward.gold}G
                </span>
              )}
              {achievement.reward.title && (
                <span className="flex items-center gap-0.5 text-primary">
                  👑 {achievement.reward.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Unlocked badge */}
        {isUnlocked && (
          <div className="absolute top-1 right-1">
            <Sparkles className="w-3 h-3 text-gold" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-gold p-0 max-w-lg max-h-[80vh] shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-gold flex flex-row items-center justify-between">
          <DialogTitle className="text-gold text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            ACHIEVEMENTS
          </DialogTitle>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {totalUnlocked}/{totalAchievements} Unlocked
          </div>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as AchievementCategory)}>
          <TabsList className="w-full grid grid-cols-6 bg-muted border-b-2 border-border rounded-none p-0">
            {Object.entries(categoryInfo).map(([key, { icon, label }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="text-[8px] py-2 px-1 rounded-none data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
                title={label}
              >
                <span className="text-sm">{icon}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(categoryInfo).map((category) => (
            <TabsContent
              key={category}
              value={category}
              className="p-4 max-h-[50vh] overflow-y-auto m-0"
            >
              <div className="grid grid-cols-1 gap-2">
                <AnimatePresence mode="wait">
                  {getAchievementsByCategory(category as AchievementCategory).map(renderAchievement)}
                </AnimatePresence>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementsModal;
