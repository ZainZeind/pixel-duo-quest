import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, BookOpen, Trophy, Settings, LogOut, Gamepad2 } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import RPGDialog from "@/components/RPGDialog";
import StatBar from "@/components/StatBar";
import QuestCard, { Quest } from "@/components/QuestCard";
import LogbookEntry from "@/components/LogbookEntry";
import WalletDisplay from "@/components/WalletDisplay";
import PartyAvatars from "@/components/PartyAvatars";
import NewQuestModal, { QuestFormData } from "@/components/modals/NewQuestModal";
import ShopModal from "@/components/modals/ShopModal";
import SkillsModal from "@/components/modals/SkillsModal";
import SettingsModal from "@/components/modals/SettingsModal";
import ArcadeZone from "@/components/games/ArcadeZone";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isPartyMode, setIsPartyMode] = useState(false);
  
  // Modal states
  const [isNewQuestOpen, setIsNewQuestOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  
  // Mock player data
  const player = {
    name: "Hero",
    level: 7,
    xp: 340,
    maxXp: 500,
    hp: 85,
    maxHp: 100,
    mp: 60,
    maxMp: 80,
    gold: 1250,
  };

  const party = {
    name: "The Lovebirds",
    level: 4,
    hearts: 78,
    maxHearts: 100,
    treasury: 5420,
    partnerName: "Partner",
    daysTogether: 156,
  };

  // Mock quests
  const [quests, setQuests] = useState<Quest[]>([
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
      title: "Conquer the Kitchen Chaos",
      description: "Prepare dinner together tonight",
      xpReward: 50,
      goldReward: 25,
      difficulty: "medium",
      status: "pending",
      scope: "shared",
    },
    {
      id: "3",
      title: "Study Session: Chapter 5",
      description: "Complete reading and exercises",
      xpReward: 40,
      goldReward: 20,
      difficulty: "medium",
      status: "in_progress",
      scope: "personal",
    },
    {
      id: "4",
      title: "Weekly Date Night",
      description: "Plan and execute a romantic evening",
      xpReward: 100,
      goldReward: 50,
      difficulty: "hard",
      status: "pending",
      scope: "shared",
    },
  ]);

  // Mock logbook entries
  const logEntries = [
    { player: "Hero", action: "completed 'Morning Workout'!", timestamp: "2h ago", type: "quest" as const },
    { player: "Partner", action: "added 100G to Treasury", timestamp: "4h ago", type: "gold" as const },
    { player: "Party", action: "reached Level 4! 🎉", timestamp: "1d ago", type: "level" as const },
    { player: "Hero", action: "sent a heart to Partner", timestamp: "1d ago", type: "heart" as const },
  ];

  const handleCompleteQuest = (questId: string) => {
    setQuests(quests.map(q => 
      q.id === questId 
        ? { ...q, status: q.scope === 'shared' ? 'waiting_approval' : 'completed' as const }
        : q
    ));
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

  const filteredQuests = quests.filter(q => 
    isPartyMode ? q.scope === 'shared' : q.scope === 'personal'
  );

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
              Day {party.daysTogether}
            </div>
          </div>
          
          <ModeToggle isPartyMode={isPartyMode} onToggle={() => setIsPartyMode(!isPartyMode)} />
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsArcadeOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
              title="Arcade Zone"
            >
              <Gamepad2 className="w-4 h-4 text-primary" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              onClick={() => navigate("/")}
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
                <RPGDialog variant="party" title={party.name}>
                  <PartyAvatars 
                    player1Name={player.name} 
                    player2Name={party.partnerName} 
                  />
                  
                  <div className="mt-6 space-y-3">
                    <div className="text-center">
                      <span className="text-[8px] text-muted-foreground">PARTY LVL</span>
                      <p className="text-lg text-party">{party.level}</p>
                    </div>
                    
                    <StatBar 
                      label="LOVE" 
                      current={party.hearts} 
                      max={party.maxHearts} 
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
                <RPGDialog variant="personal" title={player.name}>
                  <div className="flex items-center gap-4 mb-4">
                    {/* Simple pixel avatar */}
                    <motion.div 
                      className="w-16 h-20 bg-personal/20 border-2 border-personal flex items-center justify-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-2xl">🧙</span>
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-3 h-3 text-gold" />
                        <span className="text-[10px] text-gold">LVL {player.level}</span>
                      </div>
                      <p className="text-[8px] text-muted-foreground">
                        Novice Adventurer
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <StatBar label="HP" current={player.hp} max={player.maxHp} type="hp" />
                    <StatBar label="MP" current={player.mp} max={player.maxMp} type="mp" />
                    <StatBar label="XP" current={player.xp} max={player.maxXp} type="xp" />
                  </div>
                </RPGDialog>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wallet */}
          <WalletDisplay 
            personalGold={player.gold} 
            treasuryGold={party.treasury}
            isPartyMode={isPartyMode} 
          />
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
                  <p className="text-[8px] text-primary mt-2">
                    + Add New Quest
                  </p>
                </div>
              )}
            </div>
          </RPGDialog>
        </div>

        {/* Right Column - Logbook */}
        <div>
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
            
            {/* Quick chat input styled like RPG */}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t-4 border-border bg-background p-2">
        <div className="container mx-auto flex items-center justify-center gap-8">
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
        </div>
      </footer>

      {/* Modals */}
      <NewQuestModal 
        isOpen={isNewQuestOpen} 
        onClose={() => setIsNewQuestOpen(false)} 
        onSubmit={handleCreateQuest}
      />
      <ShopModal 
        isOpen={isShopOpen} 
        onClose={() => setIsShopOpen(false)} 
        playerGold={player.gold}
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
    </div>
  );
};

export default Dashboard;
