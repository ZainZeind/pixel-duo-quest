import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sword, Brain, Heart, Coins, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NewQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quest: QuestFormData) => void;
}

export interface QuestFormData {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "boss";
  scope: "personal" | "shared";
  attribute: "strength" | "intelligence" | "charisma" | "finance";
  dueDate: Date | undefined;
}

const difficultyOptions = [
  { value: "easy", label: "EASY", xp: 10, color: "text-hp-bar" },
  { value: "medium", label: "MEDIUM", xp: 30, color: "text-primary" },
  { value: "hard", label: "HARD", xp: 50, color: "text-accent" },
  { value: "boss", label: "BOSS", xp: 100, color: "text-destructive" },
];

const attributeOptions = [
  { value: "strength", label: "STR", icon: Sword, color: "text-destructive" },
  { value: "intelligence", label: "INT", icon: Brain, color: "text-mp-bar" },
  { value: "charisma", label: "CHA", icon: Heart, color: "text-accent" },
  { value: "finance", label: "FIN", icon: Coins, color: "text-hp-bar" },
];

const NewQuestModal = ({ isOpen, onClose, onSubmit }: NewQuestModalProps) => {
  const [formData, setFormData] = useState<QuestFormData>({
    title: "",
    description: "",
    difficulty: "easy",
    scope: "personal",
    attribute: "strength",
    dueDate: undefined,
  });

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        scope: "personal",
        attribute: "strength",
        dueDate: undefined,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-secondary p-0 max-w-md shadow-[4px_4px_0_hsl(var(--pixel-shadow)),inset_-4px_-4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-secondary">
          <DialogTitle className="text-secondary text-sm text-center">
            BUAT MISI BARU
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[8px] text-muted-foreground">NAMA MISI</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-muted border-4 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none transition-colors"
              placeholder="Ketik nama misi..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[8px] text-muted-foreground">DESKRIPSI</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-muted border-4 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none transition-colors resize-none h-20"
              placeholder="Jelaskan misinya..."
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-[8px] text-muted-foreground">TINGKAT KESULITAN</label>
            <div className="grid grid-cols-4 gap-2">
              {difficultyOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormData({ ...formData, difficulty: opt.value as any })}
                  className={cn(
                    "p-2 border-4 text-[8px] transition-all",
                    formData.difficulty === opt.value
                      ? "bg-muted border-secondary"
                      : "bg-background border-border hover:border-muted-foreground"
                  )}
                >
                  <span className={opt.color}>{opt.label}</span>
                  <p className="text-[6px] text-muted-foreground mt-1">{opt.xp}XP</p>
                </button>
              ))}
            </div>
          </div>

          {/* Scope Toggle */}
          <div className="space-y-2">
            <label className="text-[8px] text-muted-foreground">TIPE MISI</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, scope: "personal" })}
                className={cn(
                  "flex-1 p-3 border-4 text-[10px] transition-all",
                  formData.scope === "personal"
                    ? "bg-personal-primary/20 border-personal-primary text-personal-primary"
                    : "bg-background border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                ⚔️ SOLO
              </button>
              <button
                onClick={() => setFormData({ ...formData, scope: "shared" })}
                className={cn(
                  "flex-1 p-3 border-4 text-[10px] transition-all",
                  formData.scope === "shared"
                    ? "bg-party-primary/20 border-party-primary text-party-primary"
                    : "bg-background border-border text-muted-foreground hover:border-muted-foreground"
                )}
              >
                💕 PARTY
              </button>
            </div>
          </div>

          {/* Attribute */}
          <div className="space-y-2">
            <label className="text-[8px] text-muted-foreground">ATRIBUT</label>
            <div className="grid grid-cols-4 gap-2">
              {attributeOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFormData({ ...formData, attribute: opt.value as any })}
                    className={cn(
                      "p-2 border-4 text-[8px] transition-all flex flex-col items-center gap-1",
                      formData.attribute === opt.value
                        ? "bg-muted border-secondary"
                        : "bg-background border-border hover:border-muted-foreground"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", opt.color)} />
                    <span className="text-foreground">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-[8px] text-muted-foreground">DEADLINE</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full bg-muted border-4 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Pilih tanggal..."}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-dialog-bg border-4 border-secondary" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t-4 border-secondary flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 pixel-btn bg-muted text-muted-foreground border-muted text-[8px]"
            style={{ borderRightColor: 'hsl(220 30% 15%)', borderBottomColor: 'hsl(220 30% 15%)' }}
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 pixel-btn-secondary text-[8px]"
          >
            DEPLOY ⚔️
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewQuestModal;
