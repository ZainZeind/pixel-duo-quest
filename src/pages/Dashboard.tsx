import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scroll, BookOpen, Trophy, Settings, LogOut, Gamepad2, 
  Calendar, Camera, Target, Gift, Mail, Heart, Coins,
  PawPrint, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { MALE_AVATARS, FEMALE_AVATARS, CalendarEvent, Memory, Goal, LoveLetter } from "@/types";

// Components
import ModeToggle from "@/components/ModeToggle";
import RPGDialog from "@/components/RPGDialog";
import StatBar from "@/components/StatBar";
import QuestCard, { Quest } from "@/components/QuestCard";
import LogbookEntry from "@/components/LogbookEntry";
import WalletDisplay from "@/components/WalletDisplay";
import PartyAvatars from "@/components/PartyAvatars";
import DateIdeaGenerator from "@/components/DateIdeaGenerator";

// Modals
import NewQuestModal, { QuestFormData } from "@/components/modals/NewQuestModal";
import ShopModal from "@/components/modals/ShopModal";
import SkillsModal from "@/components/modals/SkillsModal";
import SettingsModal from "@/components/modals/SettingsModal";
import ArcadeZone from "@/components/games/ArcadeZone";
import AchievementsModal from "@/components/modals/AchievementsModal";
import FinanceModal from "@/components/modals/FinanceModal";
import CalendarModal from "@/components/modals/CalendarModal";
import MemoryGalleryModal from "@/components/modals/MemoryGalleryModal";
import DailyRewardsModal from "@/components/modals/DailyRewardsModal";
import GoalsModal from "@/components/modals/GoalsModal";
import LoveLetterModal from "@/components/modals/LoveLetterModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, couple, partner, logout, addGold, addXp, updateUser, checkDailyLogin } = useAuth();
  const [isPartyMode, setIsPartyMode] = useState(false);
  
  // Modal states
  const [isNewQuestOpen, setIsNewQuestOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isDailyRewardsOpen, setIsDailyRewardsOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [isLoveLetterOpen, setIsLoveLetterOpen] = useState(false);
  const [showDateIdeas, setShowDateIdeas] = useState(false);

  // Data states
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem("pdq_quests_user");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        title: "Defeat the Dirty Laundry Monster",
        description: "Wash and fold all clothes before sunset",
        xpReward: 30,
        goldReward: 15,
        difficulty: "easy",
        status: "pending",
        scope: "personal",
      },
      {
        id: "2",
        title: "Weekly Date Night",
        description: "Plan and execute a romantic evening",
        xpReward: 100,
        goldReward: 50,
        difficulty: "hard",
        status: "pending",
        scope: "shared",
      },
    ];
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("pdq_events_user");
    return saved ? JSON.parse(saved) : [];
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem("pdq_memories_user");
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem("pdq_goals_user");
    return saved ? JSON.parse(saved) : [];
  });

  const [letters, setLetters] = useState<LoveLetter[]>(() => {
    const saved = localStorage.getItem("pdq_letters_user");
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedAchievements] = useState<string[]>(['first_login']);
  const [achievementProgress] = useState<Record<string, number>>({
    'quest_novice': quests.filter(q => q.status === 'completed').length,
  });

  // Log entries
  type LogEntryType = "quest" | "gold" | "level" | "heart" | "system" | "achievement" | "pet";
  const [logEntries, setLogEntries] = useState<{ player: string; action: string; timestamp: string; type: LogEntryType }[]>([
    { player: user?.username || "Hero", action: "logged in!", timestamp: "Just now", type: "system" },
  ]);

  // Check for daily rewards on mount
  useEffect(() => {
    if (checkDailyLogin()) {
      setIsDailyRewardsOpen(true);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("pdq_quests_user", JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem("pdq_events_user", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem("pdq_memories_user", JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem("pdq_goals_user", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("pdq_letters_user", JSON.stringify(letters));
  }, [letters]);

  // Get avatar emoji based on user
  const getAvatarEmoji = () => {
    if (!user) return "🧙";
    const avatars = user.gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS;
    const avatar = avatars.find(a => a.id === user.avatarId);
    return avatar?.emoji || (user.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️');
  };

  const getPartnerAvatarEmoji = () => {
    if (!partner) return "🧙";
    const avatars = partner.gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS;
    const avatar = avatars.find(a => a.id === partner.avatarId);
    return avatar?.emoji || (partner.gender === 'male' ? '🧙‍♂️' : '🧙‍♀️');
  };

  // Handlers
  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    setQuests(quests.map(q => 
      q.id === questId 
        ? { ...q, status: q.scope === 'shared' ? 'waiting_approval' : 'completed' as const }
        : q
    ));

    if (quest.scope !== 'shared') {
      addXp(quest.xpReward);
      addGold(quest.goldReward);
      setLogEntries(prev => [{
        player: user?.username || "Hero",
        action: `completed '${quest.title}'!`,
        timestamp: "Just now",
        type: "quest" as const
      }, ...prev.slice(0, 9)]);
    }
  };

  const handleCreateQuest = (data: QuestFormData) => {
    const xpMap = { easy: 10, medium: 30, hard: 50, boss: 100 };
    const newQuest: Quest = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      xpReward: xpMap[data.difficulty],
      goldReward: Math.floor(xpMap[data.difficulty] / 2),
      difficulty: data.difficulty,
      status: "pending",
      scope: data.scope,
    };
    setQuests([...quests, newQuest]);
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...event, id: String(Date.now()) };
    setCalendarEvents([...calendarEvents, newEvent]);
  };

  const handleAddMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    const newMemory: Memory = { 
      ...memory, 
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    setMemories([...memories, newMemory]);
  };

  const handleAddGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = { 
      ...goal, 
      id: String(Date.now()),
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
  };

  const handleClaimDailyReward = (reward: { gold: number; xp: number }) => {
    if (reward.gold > 0) addGold(reward.gold);
    if (reward.xp > 0) addXp(reward.xp);
    updateUser({ lastDailyReward: new Date().toISOString() });
  };

  const handleSendLetter = (letter: Omit<LoveLetter, 'id' | 'createdAt' | 'isOpened'>) => {
    const newLetter: LoveLetter = {
      ...letter,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      isOpened: false,
    };
    setLetters([...letters, newLetter]);
  };

  const filteredQuests = quests.filter(q => 
    isPartyMode ? q.scope === 'shared' : q.scope === 'personal'
  );

  // Calculate days together
  const daysTogether = couple?.anniversaryDate 
    ? Math.floor((Date.now() - new Date(couple.anniversaryDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isPartyMode ? 'bg-party-bg' : 'bg-personal-bg'
    }`}>
      {/* Header */}
      <header className="border-b-4 border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-sm text-primary">COUPLE QUEST</h1>
            <div className="text-[8px] text-muted-foreground">
              Day {daysTogether > 0 ? daysTogether : (couple ? 'Together!' : 'Solo')}
            </div>
            {user && (
              <div className="text-[8px] text-gold">
                🔥 {user.loginStreak} day streak
              </div>
            )}
          </div>
          
          <ModeToggle isPartyMode={isPartyMode} onToggle={() => setIsPartyMode(!isPartyMode)} />
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDailyRewardsOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
              title="Daily Rewards"
            >
              <Gift className="w-4 h-4 text-gold" />
            </button>
            <button 
              onClick={() => setIsAchievementsOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
              title="Achievements"
            >
              <Trophy className="w-4 h-4 text-gold" />
            </button>
            <button 
              onClick={() => setIsArcadeOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
              title="Arcade Zone"
            >
              <Gamepad2 className="w-4 h-4 text-primary" />
            </button>
            <button 
              onClick={() => navigate('/pet')}
              className="p-2 hover:bg-muted transition-colors"
              title="Pet Sanctuary"
            >
              <PawPrint className="w-4 h-4 text-orange-400" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={() => { logout(); navigate("/"); }}
              className="p-2 hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Character Info */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {isPartyMode ? (
              <motion.div
                key="party"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <RPGDialog variant="party" title={couple?.name || "The Lovebirds"}>
                  <PartyAvatars 
                    player1Name={user?.username || "Hero"} 
                    player2Name={partner?.username || "Partner"} 
                    player1Avatar={getAvatarEmoji()}
                    player2Avatar={getPartnerAvatarEmoji()}
                  />
                  
                  <div className="mt-6 space-y-3">
                    <div className="text-center">
                      <span className="text-[8px] text-muted-foreground">PARTY LVL</span>
                      <p className="text-lg text-party">{couple?.level || 1}</p>
                    </div>
                    
                    <StatBar 
                      label="LOVE" 
                      current={couple?.hearts || 50} 
                      max={couple?.maxHearts || 100} 
                      type="heart" 
                    />
                  </div>
                </RPGDialog>
              </motion.div>
            ) : (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <RPGDialog variant="personal" title={user?.username || "Hero"}>
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className={`w-16 h-20 ${user?.gender === 'female' ? 'bg-heart/20 border-heart' : 'bg-personal/20 border-personal'} border-2 flex items-center justify-center`}
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-2xl">{getAvatarEmoji()}</span>
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-3 h-3 text-gold" />
                        <span className="text-[10px] text-gold">LVL {user?.level || 1}</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground">
                        {user?.gender === 'female' ? 'Adventuress' : 'Adventurer'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <StatBar label="HP" current={user?.hp || 100} max={user?.maxHp || 100} type="hp" />
                    <StatBar label="MP" current={user?.mp || 50} max={user?.maxMp || 50} type="mp" />
                    <StatBar label="XP" current={user?.xp || 0} max={user?.maxXp || 100} type="xp" />
                  </div>
                </RPGDialog>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wallet */}
          <WalletDisplay 
            personalGold={user?.gold || 0} 
            treasuryGold={couple?.treasury || 0}
            isPartyMode={isPartyMode} 
          />

          {/* Quick Actions */}
          <RPGDialog variant="default" title="Quick Actions">
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setIsFinanceOpen(true)}
                className="p-2 border border-border hover:border-gold hover:bg-gold/10 transition-all text-center"
              >
                <Coins className="w-4 h-4 mx-auto mb-1 text-gold" />
                <span className="text-[7px] text-muted-foreground">Finance</span>
              </button>
              <button 
                onClick={() => setIsCalendarOpen(true)}
                className="p-2 border border-border hover:border-primary hover:bg-primary/10 transition-all text-center"
              >
                <Calendar className="w-4 h-4 mx-auto mb-1 text-primary" />
                <span className="text-[7px] text-muted-foreground">Calendar</span>
              </button>
              <button 
                onClick={() => setIsMemoryOpen(true)}
                className="p-2 border border-border hover:border-heart hover:bg-heart/10 transition-all text-center"
              >
                <Camera className="w-4 h-4 mx-auto mb-1 text-heart" />
                <span className="text-[7px] text-muted-foreground">Memories</span>
              </button>
              <button 
                onClick={() => setIsGoalsOpen(true)}
                className="p-2 border border-border hover:border-secondary hover:bg-secondary/10 transition-all text-center"
              >
                <Target className="w-4 h-4 mx-auto mb-1 text-secondary" />
                <span className="text-[7px] text-muted-foreground">Goals</span>
              </button>
              <button 
                onClick={() => setIsLoveLetterOpen(true)}
                className="p-2 border border-border hover:border-heart hover:bg-heart/10 transition-all text-center"
              >
                <Mail className="w-4 h-4 mx-auto mb-1 text-heart" />
                <span className="text-[7px] text-muted-foreground">Letters</span>
              </button>
              <button 
                onClick={() => setShowDateIdeas(!showDateIdeas)}
                className="p-2 border border-border hover:border-pink-400 hover:bg-pink-400/10 transition-all text-center"
              >
                <Heart className="w-4 h-4 mx-auto mb-1 text-pink-400" />
                <span className="text-[7px] text-muted-foreground">Date Ideas</span>
              </button>
            </div>
          </RPGDialog>
        </div>

        {/* Center Column - Quest Board */}
        <div className="lg:col-span-1">
          <RPGDialog 
            variant={isPartyMode ? "party" : "personal"} 
            title="Quest Board"
            className="h-full"
          >
            <div className="flex items-center gap-2 mb-4">
              <Scroll className="w-4 h-4 text-primary" />
              <span className="text-[10px] text-foreground">
                {isPartyMode ? "Shared Quests" : "Personal Quests"}
              </span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onComplete={handleCompleteQuest}
                  />
                ))}
              </AnimatePresence>
              
              {filteredQuests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[8px] text-muted-foreground">
                    No active quests.
                  </p>
                  <button 
                    onClick={() => setIsNewQuestOpen(true)}
                    className="text-[8px] text-primary mt-2"
                  >
                    + Add New Quest
                  </button>
                </div>
              )}
            </div>
          </RPGDialog>
        </div>

        {/* Right Column - Logbook & Date Ideas */}
        <div className="space-y-4">
          {showDateIdeas ? (
            <DateIdeaGenerator />
          ) : (
            <RPGDialog variant="default" title="The Logbook" className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-secondary" />
                <span className="text-[10px] text-foreground">Activity Log</span>
              </div>
              
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {logEntries.map((entry, index) => (
                  <LogbookEntry key={index} {...entry} />
                ))}
              </div>
              
              {/* Quick chat input */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
                  <span className="blink">▶</span>
                  <input 
                    type="text"
                    placeholder="Send a message..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </RPGDialog>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t-4 border-border bg-background p-2">
        <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap">
          <button 
            onClick={() => setIsNewQuestOpen(true)}
            className="pixel-btn-primary text-[8px] px-3 py-1"
          >
            + NEW QUEST
          </button>
          <button 
            onClick={() => setIsShopOpen(true)}
            className="pixel-btn-secondary text-[8px] px-3 py-1"
          >
            SHOP
          </button>
          <button 
            onClick={() => setIsSkillsOpen(true)}
            className="pixel-btn-accent text-[8px] px-3 py-1"
          >
            SKILLS
          </button>
          <button 
            onClick={() => setIsFinanceOpen(true)}
            className="pixel-btn text-[8px] px-3 py-1 border-gold text-gold"
          >
            FINANCE
          </button>
        </div>
      </footer>

      {/* All Modals */}
      <NewQuestModal 
        isOpen={isNewQuestOpen} 
        onClose={() => setIsNewQuestOpen(false)} 
        onSubmit={handleCreateQuest}
      />
      <ShopModal 
        isOpen={isShopOpen} 
        onClose={() => setIsShopOpen(false)} 
        playerGold={user?.gold || 0}
      />
      <SkillsModal 
        isOpen={isSkillsOpen} 
        onClose={() => setIsSkillsOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      <ArcadeZone 
        isOpen={isArcadeOpen} 
        onClose={() => setIsArcadeOpen(false)} 
      />
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedIds={unlockedAchievements}
        progress={achievementProgress}
      />
      <FinanceModal
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        userGold={user?.gold || 0}
        onAddTransaction={() => {}}
      />
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        anniversaryDate={couple?.anniversaryDate}
        events={calendarEvents}
        onAddEvent={handleAddEvent}
      />
      <MemoryGalleryModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memories={memories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={(id) => setMemories(memories.filter(m => m.id !== id))}
      />
      <DailyRewardsModal
        isOpen={isDailyRewardsOpen}
        onClose={() => setIsDailyRewardsOpen(false)}
        currentStreak={user?.loginStreak || 0}
        lastClaimDate={user?.lastDailyReward}
        onClaimReward={handleClaimDailyReward}
        onSpinWheel={() => {}}
      />
      <GoalsModal
        isOpen={isGoalsOpen}
        onClose={() => setIsGoalsOpen(false)}
        goals={goals}
        onAddGoal={handleAddGoal}
        onUpdateGoal={(id, updates) => setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g))}
        onDeleteGoal={(id) => setGoals(goals.filter(g => g.id !== id))}
      />
      <LoveLetterModal
        isOpen={isLoveLetterOpen}
        onClose={() => setIsLoveLetterOpen(false)}
        letters={letters}
        currentUserId={user?.id || ''}
        partnerName={partner?.username}
        onSendLetter={handleSendLetter}
        onOpenLetter={(id) => setLetters(letters.map(l => l.id === id ? { ...l, isOpened: true } : l))}
      />
    </div>
  );
};

export default Dashboard;
