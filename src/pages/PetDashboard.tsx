import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Utensils, ShoppingBag, X, ArrowLeft, Trophy, 
  Star, Sparkles, Gift, Shirt
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import RPGDialog from "@/components/RPGDialog";
import PetShopModal from "@/components/pet/PetShopModal";

interface FoodItem {
  id: string;
  name: string;
  icon: string;
  hungerValue: number;
  quantity: number;
}

interface Outfit {
  id: string;
  name: string;
  icon: string;
  equipped: boolean;
}

interface Toy {
  id: string;
  name: string;
  icon: string;
  happinessValue: number;
  quantity: number;
}

interface PetState {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  hunger: number;
  happiness: number;
  currentOutfit: string | null;
  foodInventory: FoodItem[];
  outfits: Outfit[];
  toys: Toy[];
  lastUpdate: number;
  totalFed: number;
  totalPlayed: number;
}

const defaultPetState: PetState = {
  name: "Mochi",
  level: 1,
  xp: 0,
  maxXp: 100,
  hunger: 80,
  happiness: 70,
  currentOutfit: null,
  foodInventory: [
    { id: "fish", name: "Ikan", icon: "🐟", hungerValue: 20, quantity: 3 },
    { id: "milk", name: "Susu", icon: "🥛", hungerValue: 15, quantity: 2 },
  ],
  outfits: [],
  toys: [
    { id: "yarn", name: "Bola Benang", icon: "🧶", happinessValue: 15, quantity: 1 },
  ],
  lastUpdate: Date.now(),
  totalFed: 0,
  totalPlayed: 0,
};

const foodCravings = ["🐟", "🥛", "🍣", "🐠"];

const PetDashboard = () => {
  const navigate = useNavigate();
  const { user, spendGold } = useAuth();
  
  const [petState, setPetState] = useState<PetState>(() => {
    const saved = localStorage.getItem("petState");
    if (saved) {
      const parsed = JSON.parse(saved);
      const timeDiff = (Date.now() - parsed.lastUpdate) / 60000;
      const hungerDecrease = Math.floor(timeDiff * 0.5);
      const happinessDecrease = Math.floor(timeDiff * 0.3);
      return {
        ...parsed,
        hunger: Math.max(0, parsed.hunger - hungerDecrease),
        happiness: Math.max(0, parsed.happiness - happinessDecrease),
        lastUpdate: Date.now(),
      };
    }
    return defaultPetState;
  });

  const [animation, setAnimation] = useState<"idle" | "eating" | "happy" | "hungry" | "sleeping">("idle");
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showToyMenu, setShowToyMenu] = useState(false);
  const [showOutfitMenu, setShowOutfitMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [currentCraving, setCurrentCraving] = useState(foodCravings[0]);
  const [showHearts, setShowHearts] = useState(false);
  const [logMessage, setLogMessage] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(petState.name);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("petState", JSON.stringify({ ...petState, lastUpdate: Date.now() }));
  }, [petState]);

  // Hunger/happiness decrease timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPetState(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
      }));
    }, 120000); // Every 2 minutes

    return () => clearInterval(timer);
  }, []);

  // Update animation based on state
  useEffect(() => {
    if (petState.hunger < 20) {
      setAnimation("hungry");
    } else if (petState.happiness < 20) {
      setAnimation("sleeping");
    } else if (animation !== "eating" && animation !== "happy") {
      setAnimation("idle");
    }
  }, [petState.hunger, petState.happiness, animation]);

  // Random craving change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCraving(foodCravings[Math.floor(Math.random() * foodCravings.length)]);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const showLog = useCallback((message: string) => {
    setLogMessage(message);
    setTimeout(() => setLogMessage(null), 2000);
  }, []);

  const addPetXp = (amount: number) => {
    setPetState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;

      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.floor(newMaxXp * 1.3);
        showLog(`🎉 ${prev.name} naik ke Level ${newLevel}!`);
      }

      return { ...prev, xp: newXp, level: newLevel, maxXp: newMaxXp };
    });
  };

  const feedPet = (food: FoodItem) => {
    if (food.quantity <= 0) return;

    const isCorrectCraving = food.icon === currentCraving;
    const hungerGain = isCorrectCraving ? food.hungerValue * 2 : food.hungerValue;
    const happinessGain = isCorrectCraving ? 10 : 5;
    const xpGain = isCorrectCraving ? 15 : 8;

    setPetState(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + hungerGain),
      happiness: Math.min(100, prev.happiness + happinessGain),
      totalFed: prev.totalFed + 1,
      foodInventory: prev.foodInventory.map(f =>
        f.id === food.id ? { ...f, quantity: f.quantity - 1 } : f
      ),
    }));

    addPetXp(xpGain);
    setAnimation("eating");
    showLog(isCorrectCraving ? "Makanan favorit! +2x Bonus!" : `${petState.name} makan ${food.name}!`);
    setShowFoodMenu(false);

    setTimeout(() => setAnimation("idle"), 1500);
  };

  const petTheCat = () => {
    setShowHearts(true);
    setAnimation("happy");
    setPetState(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 5),
    }));
    addPetXp(3);
    showLog(`Kamu mengelus ${petState.name}! Purrr~`);

    setTimeout(() => {
      setShowHearts(false);
      setAnimation("idle");
    }, 1500);
  };

  const useToy = (toy: Toy) => {
    if (toy.quantity <= 0) return;

    setPetState(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + toy.happinessValue),
      totalPlayed: prev.totalPlayed + 1,
      toys: prev.toys.map(t =>
        t.id === toy.id ? { ...t, quantity: t.quantity - 1 } : t
      ),
    }));

    addPetXp(10);
    setAnimation("happy");
    showLog(`${petState.name} bermain dengan ${toy.name}!`);
    setShowToyMenu(false);
    setTimeout(() => setAnimation("idle"), 1500);
  };

  const handlePurchase = (type: "food" | "outfit" | "toy", item: any) => {
    if (!user || user.gold < item.price) return;

    const success = spendGold(item.price);
    if (!success) return;

    setPetState(prev => {
      if (type === "food") {
        const existing = prev.foodInventory.find(f => f.id === item.id);
        if (existing) {
          return {
            ...prev,
            foodInventory: prev.foodInventory.map(f =>
              f.id === item.id ? { ...f, quantity: f.quantity + 1 } : f
            ),
          };
        }
        return {
          ...prev,
          foodInventory: [...prev.foodInventory, { ...item, quantity: 1 }],
        };
      } else if (type === "outfit") {
        return {
          ...prev,
          outfits: [...prev.outfits, { ...item, equipped: false }],
        };
      } else {
        const existing = prev.toys.find(t => t.id === item.id);
        if (existing) {
          return {
            ...prev,
            toys: prev.toys.map(t =>
              t.id === item.id ? { ...t, quantity: t.quantity + 1 } : t
            ),
          };
        }
        return {
          ...prev,
          toys: [...prev.toys, { ...item, quantity: 1 }],
        };
      }
    });

    showLog(`Membeli ${item.name}!`);
  };

  const equipOutfit = (outfitId: string) => {
    setPetState(prev => ({
      ...prev,
      currentOutfit: prev.currentOutfit === outfitId ? null : outfitId,
      outfits: prev.outfits.map(o => ({
        ...o,
        equipped: o.id === outfitId ? !o.equipped : false,
      })),
    }));
  };

  const handleNameChange = () => {
    if (newName.trim()) {
      setPetState(prev => ({ ...prev, name: newName.trim() }));
      showLog(`Nama diubah menjadi ${newName.trim()}!`);
    }
    setIsEditingName(false);
  };

  const currentOutfitData = petState.outfits.find(o => o.id === petState.currentOutfit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] relative">
      {/* Header */}
      <header className="border-b-4 border-primary/50 p-4 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px]">KEMBALI</span>
          </button>
          
          <h1 className="text-sm text-primary">🐱 PET SANCTUARY</h1>
          
          <div className="flex items-center gap-2 text-[10px] text-gold">
            <span>💰 {user?.gold || 0}G</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
        {/* Left Column - Pet Stats */}
        <div className="space-y-4">
          <RPGDialog variant="party" title="Pet Stats">
            {/* Pet Level */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-gold" />
                <span className="text-lg text-gold">LVL {petState.level}</span>
              </div>
              <div className="h-2 bg-background/50 border border-gold/50 overflow-hidden mb-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold to-yellow-400"
                  animate={{ width: `${(petState.xp / petState.maxXp) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[8px] text-muted-foreground">
                {petState.xp}/{petState.maxXp} XP
              </span>
            </div>

            {/* Status Bars */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-orange-400" />
                    <span className="text-[8px] text-orange-400">HUNGER</span>
                  </div>
                  <span className="text-[8px] text-orange-400">{Math.round(petState.hunger)}%</span>
                </div>
                <div className="h-3 bg-background/50 border border-orange-400/50 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                    animate={{ width: `${petState.hunger}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-pink-400" />
                    <span className="text-[8px] text-pink-400">HAPPINESS</span>
                  </div>
                  <span className="text-[8px] text-pink-400">{Math.round(petState.happiness)}%</span>
                </div>
                <div className="h-3 bg-background/50 border border-pink-400/50 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                    animate={{ width: `${petState.happiness}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[8px]">
              <div className="bg-muted/30 p-2 text-center border border-border">
                <div className="text-lg">🍽️</div>
                <div className="text-muted-foreground">Total Fed</div>
                <div className="text-primary">{petState.totalFed}</div>
              </div>
              <div className="bg-muted/30 p-2 text-center border border-border">
                <div className="text-lg">🎮</div>
                <div className="text-muted-foreground">Times Played</div>
                <div className="text-primary">{petState.totalPlayed}</div>
              </div>
            </div>
          </RPGDialog>

          {/* Achievements preview */}
          <RPGDialog variant="default" title="Pet Achievements">
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: "🌟", unlocked: petState.level >= 5, title: "Reach Lv.5" },
                { icon: "🍴", unlocked: petState.totalFed >= 50, title: "Feed 50x" },
                { icon: "🎾", unlocked: petState.totalPlayed >= 30, title: "Play 30x" },
                { icon: "👑", unlocked: petState.outfits.length >= 3, title: "3 Outfits" },
              ].map((ach, i) => (
                <div 
                  key={i}
                  className={`p-2 text-center border ${ach.unlocked ? 'border-gold bg-gold/10' : 'border-border opacity-50'}`}
                  title={ach.title}
                >
                  <span className="text-lg">{ach.icon}</span>
                </div>
              ))}
            </div>
          </RPGDialog>
        </div>

        {/* Center Column - Pet Display */}
        <div className="lg:col-span-1">
          <RPGDialog variant="party" title={petState.name} className="h-full">
            {/* Pet Name Editor */}
            <div className="text-center mb-4">
              {isEditingName ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-muted border border-primary px-2 py-1 text-[10px] w-24 text-center"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
                  />
                  <button 
                    onClick={handleNameChange}
                    className="text-[8px] text-primary"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="text-[10px] text-muted-foreground hover:text-primary"
                >
                  ✏️ Edit Name
                </button>
              )}
            </div>

            {/* Pet Display Area */}
            <div className="relative flex items-center justify-center py-8">
              {/* Speech Bubble with Craving */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 right-4 bg-white text-background px-3 py-2 rounded-lg border-2 border-foreground z-10"
                style={{ fontSize: "20px" }}
              >
                {currentCraving}
                <div className="absolute -bottom-1 left-3 w-2 h-2 bg-white border-r-2 border-b-2 border-foreground transform rotate-45" />
              </motion.div>

              {/* Cat Container */}
              <motion.div
                className="relative cursor-pointer"
                onClick={petTheCat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Hearts Animation */}
                <AnimatePresence>
                  {showHearts && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 1, y: 0, x: 0 }}
                          animate={{
                            opacity: 0,
                            y: -60,
                            x: (i - 4) * 20,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2 }}
                          className="absolute top-0 left-1/2 text-heart text-xl"
                        >
                          ❤️
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Pixel Cat - Larger Version */}
                <motion.div
                  animate={
                    animation === "idle"
                      ? { y: [0, -4, 0] }
                      : animation === "eating"
                      ? { rotate: [-5, 5, -5, 5, 0] }
                      : animation === "happy"
                      ? { y: [0, -15, 0], scale: [1, 1.15, 1] }
                      : animation === "sleeping"
                      ? { y: [0, 2, 0], opacity: [1, 0.8, 1] }
                      : { y: [0, 3, 0] }
                  }
                  transition={{
                    duration: animation === "idle" ? 2 : animation === "sleeping" ? 3 : 0.5,
                    repeat: animation === "idle" || animation === "hungry" || animation === "sleeping" ? Infinity : 0,
                  }}
                  className="relative"
                >
                  {/* Cat Body - Larger Pixel Art */}
                  <div className="grid grid-cols-10 gap-0" style={{ width: "120px", height: "120px" }}>
                    {/* Row 1 - Ears */}
                    <div className="col-span-2" />
                    <div className="bg-orange-400 col-span-1" />
                    <div className="col-span-4" />
                    <div className="bg-orange-400 col-span-1" />
                    <div className="col-span-2" />
                    
                    {/* Row 2 - Ears */}
                    <div className="col-span-1" />
                    <div className="bg-orange-400 col-span-1" />
                    <div className="bg-orange-300 col-span-1" />
                    <div className="bg-orange-400 col-span-4" />
                    <div className="bg-orange-300 col-span-1" />
                    <div className="bg-orange-400 col-span-1" />
                    <div className="col-span-1" />
                    
                    {/* Row 3 - Head */}
                    <div className="col-span-1" />
                    <div className="bg-orange-400 col-span-8" />
                    <div className="col-span-1" />
                    
                    {/* Row 4 - Eyes */}
                    <div className="col-span-1" />
                    <div className="bg-orange-400 col-span-1" />
                    <motion.div 
                      className="bg-foreground col-span-1"
                      animate={animation === "idle" || animation === "sleeping" ? { scaleY: animation === "sleeping" ? 0.1 : [1, 0.1, 1] } : {}}
                      transition={{ duration: 0.2, repeat: animation === "idle" ? Infinity : 0, repeatDelay: 3 }}
                    />
                    <div className="bg-orange-400 col-span-1" />
                    <div className="bg-pink-300 col-span-2" />
                    <div className="bg-orange-400 col-span-1" />
                    <motion.div 
                      className="bg-foreground col-span-1"
                      animate={animation === "idle" || animation === "sleeping" ? { scaleY: animation === "sleeping" ? 0.1 : [1, 0.1, 1] } : {}}
                      transition={{ duration: 0.2, repeat: animation === "idle" ? Infinity : 0, repeatDelay: 3 }}
                    />
                    <div className="bg-orange-400 col-span-1" />
                    <div className="col-span-1" />
                    
                    {/* Row 5 - Cheeks */}
                    <div className="col-span-1" />
                    <div className="bg-pink-200 col-span-1" />
                    <div className="bg-orange-400 col-span-6" />
                    <div className="bg-pink-200 col-span-1" />
                    <div className="col-span-1" />
                    
                    {/* Row 6 - Nose */}
                    <div className="col-span-1" />
                    <div className="bg-orange-400 col-span-3" />
                    <div className={`col-span-2 ${animation === "hungry" ? "bg-gray-400" : animation === "eating" ? "bg-pink-400" : "bg-pink-300"}`} />
                    <div className="bg-orange-400 col-span-3" />
                    <div className="col-span-1" />
                    
                    {/* Row 7 - Mouth */}
                    <div className="col-span-1" />
                    <div className="bg-orange-400 col-span-8" />
                    <div className="col-span-1" />
                    
                    {/* Row 8 - Body */}
                    <div className="col-span-2" />
                    <div className="bg-orange-400 col-span-6" />
                    <div className="col-span-2" />
                    
                    {/* Row 9 - Body lower */}
                    <div className="col-span-2" />
                    <div className="bg-orange-400 col-span-6" />
                    <div className="col-span-2" />
                    
                    {/* Row 10 - Feet */}
                    <div className="col-span-2" />
                    <div className="bg-orange-300 col-span-2" />
                    <div className="bg-orange-400 col-span-2" />
                    <div className="bg-orange-300 col-span-2" />
                    <div className="col-span-2" />
                  </div>

                  {/* Outfit Overlay */}
                  {currentOutfitData && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl">
                      {currentOutfitData.icon}
                    </div>
                  )}

                  {/* Status indicators */}
                  {animation === "hungry" && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl"
                    >
                      😢
                    </motion.div>
                  )}
                  {animation === "sleeping" && (
                    <motion.div
                      animate={{ opacity: [0, 1, 0], y: [-5, -15, -5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-8 right-0 text-xl"
                    >
                      💤
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Log Message */}
            <AnimatePresence>
              {logMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[10px] text-primary mb-4"
                >
                  {logMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setShowFoodMenu(!showFoodMenu)}
                className="pixel-btn text-[10px] py-3 bg-orange-500 hover:bg-orange-400 flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                FEED
              </button>
              <button
                onClick={() => setShowToyMenu(!showToyMenu)}
                className="pixel-btn text-[10px] py-3 bg-pink-500 hover:bg-pink-400 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                PLAY
              </button>
              <button
                onClick={() => setShowOutfitMenu(!showOutfitMenu)}
                className="pixel-btn text-[10px] py-3 bg-purple-500 hover:bg-purple-400 flex items-center justify-center gap-2"
              >
                <Shirt className="w-4 h-4" />
                OUTFIT
              </button>
              <button
                onClick={() => setShowShop(true)}
                className="pixel-btn text-[10px] py-3 bg-gold hover:bg-gold/80 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                SHOP
              </button>
            </div>
          </RPGDialog>
        </div>

        {/* Right Column - Inventory & Menus */}
        <div className="space-y-4">
          {/* Food Inventory */}
          <RPGDialog variant="default" title="Food Inventory">
            <div className="space-y-2">
              {petState.foodInventory.filter(f => f.quantity > 0).length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-4">
                  Inventory kosong! Beli makanan di shop.
                </p>
              ) : (
                petState.foodInventory.filter(f => f.quantity > 0).map(food => (
                  <button
                    key={food.id}
                    onClick={() => feedPet(food)}
                    className={`w-full flex items-center justify-between p-2 border border-border hover:bg-primary/20 transition-all ${
                      food.icon === currentCraving ? "border-gold bg-gold/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{food.icon}</span>
                      <span className="text-[10px]">{food.name}</span>
                      {food.icon === currentCraving && (
                        <Star className="w-3 h-3 text-gold" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">x{food.quantity}</span>
                  </button>
                ))
              )}
            </div>
          </RPGDialog>

          {/* Toys Inventory */}
          <RPGDialog variant="default" title="Toys">
            <div className="space-y-2">
              {petState.toys.filter(t => t.quantity > 0).length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-4">
                  Tidak ada mainan. Beli di shop!
                </p>
              ) : (
                petState.toys.filter(t => t.quantity > 0).map(toy => (
                  <button
                    key={toy.id}
                    onClick={() => useToy(toy)}
                    className="w-full flex items-center justify-between p-2 border border-border hover:bg-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{toy.icon}</span>
                      <span className="text-[10px]">{toy.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">x{toy.quantity}</span>
                  </button>
                ))
              )}
            </div>
          </RPGDialog>

          {/* Outfits */}
          <RPGDialog variant="default" title="Outfits">
            <div className="grid grid-cols-4 gap-2">
              {petState.outfits.length === 0 ? (
                <p className="col-span-4 text-[10px] text-muted-foreground text-center py-4">
                  Belum punya outfit. Beli di shop!
                </p>
              ) : (
                petState.outfits.map(outfit => (
                  <button
                    key={outfit.id}
                    onClick={() => equipOutfit(outfit.id)}
                    className={`p-2 border text-center transition-all ${
                      outfit.equipped 
                        ? "border-primary bg-primary/20" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-xl">{outfit.icon}</span>
                  </button>
                ))
              )}
            </div>
          </RPGDialog>
        </div>
      </main>

      {/* Pet Shop Modal */}
      <PetShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        playerGold={user?.gold || 0}
        ownedOutfits={petState.outfits}
        onPurchase={handlePurchase}
        onEquipOutfit={equipOutfit}
      />
    </div>
  );
};

export default PetDashboard;
