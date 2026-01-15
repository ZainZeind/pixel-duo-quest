import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, Plus, Check, Trash2, TrendingUp, Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Goal, GoalCategory } from "@/types";

interface GoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

const categoryInfo: Record<GoalCategory, { icon: string; color: string }> = {
  relationship: { icon: "💕", color: "text-heart" },
  career: { icon: "💼", color: "text-blue-400" },
  health: { icon: "💪", color: "text-green-400" },
  financial: { icon: "💰", color: "text-gold" },
  travel: { icon: "✈️", color: "text-cyan-400" },
  learning: { icon: "📚", color: "text-purple-400" },
  other: { icon: "🎯", color: "text-primary" },
};

const GoalsModal = ({ isOpen, onClose, goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsModalProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalCategory>("relationship");
  const [newTarget, setNewTarget] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const handleAddGoal = () => {
    if (!newTitle || !newTarget) return;
    
    onAddGoal({
      title: newTitle,
      category: newCategory,
      targetValue: Number(newTarget),
      currentValue: 0,
      unit: newUnit || "times",
      deadline: newDeadline || undefined,
      isShared: false,
      createdBy: 'user',
    });
    
    // Reset form
    setNewTitle("");
    setNewTarget("");
    setNewUnit("");
    setNewDeadline("");
    setShowAddForm(false);
  };

  const handleProgress = (goal: Goal, increment: number) => {
    const newValue = Math.min(goal.currentValue + increment, goal.targetValue);
    onUpdateGoal(goal.id, { currentValue: newValue });
  };

  const activeGoals = goals.filter(g => g.currentValue < g.targetValue);
  const completedGoals = goals.filter(g => g.currentValue >= g.targetValue);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-primary p-0 max-w-lg max-h-[85vh] shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-primary flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            GOALS & MILESTONES
          </DialogTitle>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="pixel-btn text-[8px] py-1 px-2 bg-primary hover:bg-primary/80"
          >
            <Plus className="w-3 h-3 inline" /> NEW
          </button>
        </DialogHeader>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
          {/* Add Form */}
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-4 border-2 border-dashed border-primary bg-primary/5 space-y-3"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Goal title..."
                className="w-full bg-muted border border-border p-2 text-[10px]"
              />
              
              <div className="grid grid-cols-7 gap-1">
                {(Object.keys(categoryInfo) as GoalCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`p-2 border ${newCategory === cat ? 'border-primary bg-primary/20' : 'border-border'}`}
                    title={cat}
                  >
                    <span>{categoryInfo[cat].icon}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="Target"
                  className="bg-muted border border-border p-2 text-[10px]"
                />
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Unit (e.g., km)"
                  className="bg-muted border border-border p-2 text-[10px]"
                />
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="bg-muted border border-border p-2 text-[10px]"
                />
              </div>
              
              <button
                onClick={handleAddGoal}
                disabled={!newTitle || !newTarget}
                className="w-full pixel-btn-primary py-2 text-[9px] disabled:opacity-50"
              >
                CREATE GOAL
              </button>
            </motion.div>
          )}

          {/* Active Goals */}
          <div>
            <h3 className="text-[10px] text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Active Goals ({activeGoals.length})
            </h3>
            <div className="space-y-2">
              {activeGoals.length === 0 ? (
                <p className="text-[9px] text-muted-foreground text-center py-4">
                  No active goals. Create one to get started!
                </p>
              ) : (
                activeGoals.map(goal => {
                  const progress = (goal.currentValue / goal.targetValue) * 100;
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 border-2 border-border hover:border-primary transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryInfo[goal.category].icon}</span>
                          <div>
                            <h4 className="text-[10px] text-foreground">{goal.title}</h4>
                            {goal.deadline && (
                              <p className="text-[7px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-2 h-2" />
                                Due: {new Date(goal.deadline).toLocaleDateString('id-ID')}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="text-muted-foreground hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-[8px] mb-1">
                          <span className="text-muted-foreground">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                          <span className={categoryInfo[goal.category].color}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted border border-border overflow-hidden">
                          <motion.div
                            className={`h-full ${categoryInfo[goal.category].color.replace('text-', 'bg-')}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Quick increment buttons */}
                      <div className="flex gap-1">
                        {[1, 5, 10].map(inc => (
                          <button
                            key={inc}
                            onClick={() => handleProgress(goal, inc)}
                            className="flex-1 text-[8px] py-1 border border-border hover:border-primary hover:bg-primary/10"
                          >
                            +{inc}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h3 className="text-[10px] text-foreground mb-2 flex items-center gap-2">
                <Check className="w-3 h-3 text-green-400" /> Completed ({completedGoals.length})
              </h3>
              <div className="space-y-2">
                {completedGoals.map(goal => (
                  <div
                    key={goal.id}
                    className="p-2 border-2 border-green-500/50 bg-green-500/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{categoryInfo[goal.category].icon}</span>
                      <span className="text-[9px] text-foreground line-through opacity-75">
                        {goal.title}
                      </span>
                    </div>
                    <span className="text-green-400 text-sm">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalsModal;
