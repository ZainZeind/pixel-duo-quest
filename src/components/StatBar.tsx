import { motion } from "framer-motion";

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  type: "hp" | "mp" | "xp" | "heart" | "gold";
  showLabel?: boolean;
}

const StatBar = ({ label, current, max, type, showLabel = true }: StatBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const barColors = {
    hp: "bg-hp",
    mp: "bg-mp",
    xp: "xp-stripes",
    heart: "bg-heart",
    gold: "bg-gold",
  };

  const labelColors = {
    hp: "text-hp",
    mp: "text-mp",
    xp: "text-xp",
    heart: "text-heart",
    gold: "text-gold",
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-[8px]">
          <span className={labelColors[type]}>{label}</span>
          <span className="text-foreground">
            {current}/{max}
          </span>
        </div>
      )}
      <div className="stat-bar">
        <motion.div
          className={`stat-bar-fill ${barColors[type]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default StatBar;
