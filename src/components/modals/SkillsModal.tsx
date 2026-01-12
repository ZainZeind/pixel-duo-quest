import { motion } from "framer-motion";
import { Sword, Brain, Heart, Coins, Sparkles, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Skill {
  name: string;
  label: string;
  level: number;
  xp: number;
  maxXp: number;
  icon: typeof Sword;
  color: string;
  bgColor: string;
}

const skills: Skill[] = [
  { 
    name: "strength", 
    label: "STRENGTH", 
    level: 5, 
    xp: 340, 
    maxXp: 500,
    icon: Sword, 
    color: "hsl(0 70% 50%)", 
    bgColor: "bg-destructive" 
  },
  { 
    name: "intelligence", 
    label: "INTELLIGENCE", 
    level: 8, 
    xp: 180, 
    maxXp: 400,
    icon: Brain, 
    color: "hsl(220 70% 55%)", 
    bgColor: "bg-mp-bar" 
  },
  { 
    name: "charisma", 
    label: "CHARISMA", 
    level: 6, 
    xp: 420, 
    maxXp: 600,
    icon: Heart, 
    color: "hsl(350 80% 60%)", 
    bgColor: "bg-accent" 
  },
  { 
    name: "finance", 
    label: "FINANCE", 
    level: 4, 
    xp: 150, 
    maxXp: 300,
    icon: Coins, 
    color: "hsl(120 60% 45%)", 
    bgColor: "bg-hp-bar" 
  },
];

const SkillsModal = ({ isOpen, onClose }: SkillsModalProps) => {
  const totalLevel = skills.reduce((acc, s) => acc + s.level, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-accent p-0 max-w-md shadow-[4px_4px_0_hsl(var(--pixel-shadow)),inset_-4px_-4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-accent">
          <DialogTitle className="text-accent text-sm text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            STATUS KARAKTER
            <Sparkles className="w-4 h-4" />
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Total Level Summary */}
          <div className="bg-muted border-4 border-border p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-[10px] text-muted-foreground">TOTAL POWER LEVEL</span>
              <Star className="w-4 h-4 text-gold" />
            </div>
            <p className="text-2xl text-gold pulse-glow">{totalLevel}</p>
          </div>

          {/* Skill Bars */}
          <div className="space-y-4">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              const percentage = (skill.xp / skill.maxXp) * 100;
              
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  {/* Skill Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 border-2 flex items-center justify-center"
                        style={{ borderColor: skill.color, backgroundColor: `${skill.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: skill.color }} />
                      </div>
                      <span className="text-[10px] text-foreground">{skill.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-sm font-bold"
                        style={{ color: skill.color }}
                      >
                        LVL {skill.level}
                      </span>
                    </div>
                  </div>

                  {/* XP Bar */}
                  <div className="relative">
                    <div className="h-6 bg-muted border-4 border-border overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[8px] text-foreground drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {skill.xp} / {skill.maxXp} XP
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="bg-muted/50 border-2 border-dashed border-border p-3">
            <p className="text-[8px] text-muted-foreground text-center">
              💡 Selesaikan quest untuk menaikkan level atribut!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsModal;
