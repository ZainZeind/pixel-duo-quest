import { motion } from "framer-motion";
import { Check, Clock, Star, Coins } from "lucide-react";

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  goldReward: number;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "in_progress" | "waiting_approval" | "completed";
  scope: "personal" | "shared";
}

interface QuestCardProps {
  quest: Quest;
  onComplete?: (id: string) => void;
}

const QuestCard = ({ quest, onComplete }: QuestCardProps) => {
  const difficultyStars = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const statusColors = {
    pending: "border-muted-foreground",
    in_progress: "border-primary",
    waiting_approval: "border-secondary",
    completed: "border-hp",
  };

  const statusIcons = {
    pending: null,
    in_progress: <Clock className="w-3 h-3 text-primary" />,
    waiting_approval: <Clock className="w-3 h-3 text-secondary animate-pulse" />,
    completed: <Check className="w-3 h-3 text-hp" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`
        quest-card cursor-pointer
        ${quest.status === "completed" ? "opacity-60" : ""}
      `}
      style={{
        borderColor: `hsl(var(--${quest.scope === 'personal' ? 'personal-primary' : 'party-primary'}))`,
      }}
      onClick={() => quest.status !== "completed" && onComplete?.(quest.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcons[quest.status]}
          <span className={`text-[8px] uppercase px-2 py-0.5 ${
            quest.scope === 'personal' ? 'bg-personal/20 text-personal' : 'bg-party/20 text-party'
          }`}>
            {quest.scope}
          </span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: difficultyStars[quest.difficulty] }).map((_, i) => (
            <Star key={i} className="w-2 h-2 text-gold fill-gold" />
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[10px] text-foreground mb-1 leading-relaxed">
        {quest.title}
      </h3>

      {/* Description */}
      <p className="text-[7px] text-muted-foreground mb-3 leading-relaxed">
        {quest.description}
      </p>

      {/* Rewards */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <span className="text-[8px] text-xp">+{quest.xpReward} XP</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="w-3 h-3 text-gold" />
          <span className="text-[8px] text-gold">{quest.goldReward}G</span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestCard;
