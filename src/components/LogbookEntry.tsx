import { motion } from "framer-motion";

interface LogbookEntryProps {
  player: string;
  action: string;
  timestamp: string;
  type: "quest" | "gold" | "level" | "heart" | "system" | "achievement" | "pet";
}

const LogbookEntry = ({ player, action, timestamp, type }: LogbookEntryProps) => {
  const typeColors: Record<LogbookEntryProps['type'], string> = {
    quest: "text-secondary",
    gold: "text-gold",
    level: "text-xp",
    heart: "text-heart",
    system: "text-primary",
    achievement: "text-gold",
    pet: "text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-2 py-2 border-b border-border/50 last:border-b-0"
    >
      <span className="text-primary">▶</span>
      <div className="flex-1">
        <p className="text-[8px] leading-relaxed">
          <span className={typeColors[type]}>{player}</span>
          <span className="text-foreground"> {action}</span>
        </p>
        <span className="text-[6px] text-muted-foreground">{timestamp}</span>
      </div>
    </motion.div>
  );
};

export default LogbookEntry;
