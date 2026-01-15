import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Utensils, ShoppingBag, X } from "lucide-react";
import RPGDialog from "../RPGDialog";
import StatBar from "../StatBar";
import PetShopModal from "./PetShopModal";

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
  hunger: number;
  happiness: number;
  currentOutfit: string | null;
  foodInventory: FoodItem[];
  outfits: Outfit[];
  toys: Toy[];
  lastUpdate: number;
}

const defaultPetState: PetState = {
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
};

const foodCravings = ["🐟", "🥛", "🍣", "🐠"];

const PetWidget = ({ playerGold, onSpendGold }: { playerGold: number; onSpendGold: (amount: number) => void }) => {
  const [petState, setPetState] = useState<PetState>(() => {
    const saved = localStorage.getItem("petState");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Calculate hunger decrease since last update
      const timeDiff = (Date.now() - parsed.lastUpdate) / 60000; // minutes
      const hungerDecrease = Math.floor(timeDiff * 2); // 2 points per minute
      return {
        ...parsed,
        hunger: Math.max(0, parsed.hunger - hungerDecrease),
        lastUpdate: Date.now(),
      };
    }
    return defaultPetState;
  });

  const [animation, setAnimation] = useState<"idle" | "eating" | "happy" | "hungry">("idle");
  const [showFoodMenu, setShowFoodMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [currentCraving, setCurrentCraving] = useState(foodCravings[0]);
  const [showHearts, setShowHearts] = useState(false);
  const [logMessage, setLogMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("petState", JSON.stringify({ ...petState, lastUpdate: Date.now() }));
  }, [petState]);

  // Hunger decrease timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPetState(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
      }));
    }, 60000); // Every minute

    return () => clearInterval(timer);
  }, []);

  // Update animation based on state
  useEffect(() => {
    if (petState.hunger < 30) {
      setAnimation("hungry");
    } else if (animation !== "eating" && animation !== "happy") {
      setAnimation("idle");
    }
  }, [petState.hunger, animation]);

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

  const feedPet = (food: FoodItem) => {
    if (food.quantity <= 0) return;

    const isCorrectCraving = food.icon === currentCraving;
    const hungerGain = isCorrectCraving ? food.hungerValue * 2 : food.hungerValue;
    const happinessGain = isCorrectCraving ? 10 : 5;

    setPetState(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + hungerGain),
      happiness: Math.min(100, prev.happiness + happinessGain),
      foodInventory: prev.foodInventory.map(f =>
        f.id === food.id ? { ...f, quantity: f.quantity - 1 } : f
      ),
    }));

    setAnimation("eating");
    showLog(isCorrectCraving ? "Makanan favorit! +2x Bonus!" : `Kucing makan ${food.name}!`);
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
    showLog("Kamu mengelus kucing! Purrr~");

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
      toys: prev.toys.map(t =>
        t.id === toy.id ? { ...t, quantity: t.quantity - 1 } : t
      ),
    }));

    setAnimation("happy");
    showLog(`Kucing bermain dengan ${toy.name}!`);
    setTimeout(() => setAnimation("idle"), 1500);
  };

  const handlePurchase = (type: "food" | "outfit" | "toy", item: any) => {
    if (playerGold < item.price) return;

    onSpendGold(item.price);

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

  const currentOutfitData = petState.outfits.find(o => o.id === petState.currentOutfit);

  return (
    <>
      <RPGDialog variant="party" title="Guild Mascot" className="relative">
        <div className="space-y-3">
          {/* Status Bars */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Utensils className="w-3 h-3 text-orange-400" />
                <span className="text-[6px] text-orange-400">HUNGER</span>
              </div>
              <div className="h-2 bg-background/50 border border-orange-400/50 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  animate={{ width: `${petState.hunger}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className="text-[6px] text-pink-400">HAPPINESS</span>
              </div>
              <div className="h-2 bg-background/50 border border-pink-400/50 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                  animate={{ width: `${petState.happiness}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Pet Display Area */}
          <div className="relative flex items-center justify-center py-4">
            {/* Speech Bubble with Craving */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 right-2 bg-white text-background px-2 py-1 rounded-lg border-2 border-foreground"
              style={{ fontSize: "16px" }}
            >
              {currentCraving}
              <div className="absolute -bottom-1 left-2 w-2 h-2 bg-white border-r-2 border-b-2 border-foreground transform rotate-45" />
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
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 1, y: 0, x: 0 }}
                        animate={{
                          opacity: 0,
                          y: -40,
                          x: (i - 2) * 15,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute top-0 left-1/2 text-heart text-lg"
                      >
                        ❤️
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Pixel Cat */}
              <motion.div
                animate={
                  animation === "idle"
                    ? { y: [0, -2, 0] }
                    : animation === "eating"
                    ? { rotate: [-5, 5, -5, 5, 0] }
                    : animation === "happy"
                    ? { y: [0, -10, 0], scale: [1, 1.1, 1] }
                    : { y: [0, 2, 0] }
                }
                transition={{
                  duration: animation === "idle" ? 2 : 0.5,
                  repeat: animation === "idle" || animation === "hungry" ? Infinity : 0,
                }}
                className="relative"
              >
                {/* Cat Body - Pixel Art */}
                <div className="grid grid-cols-8 gap-0" style={{ width: "64px", height: "64px" }}>
                  {/* Row 1 - Ears */}
                  <div className="col-span-1" />
                  <div className="bg-orange-400 col-span-1" />
                  <div className="col-span-4" />
                  <div className="bg-orange-400 col-span-1" />
                  <div className="col-span-1" />
                  
                  {/* Row 2 - Ears */}
                  <div className="bg-orange-400 col-span-1" />
                  <div className="bg-orange-300 col-span-1" />
                  <div className="bg-orange-400 col-span-4" />
                  <div className="bg-orange-300 col-span-1" />
                  <div className="bg-orange-400 col-span-1" />
                  
                  {/* Row 3 - Head top */}
                  <div className="bg-orange-400 col-span-8" />
                  
                  {/* Row 4 - Eyes */}
                  <div className="bg-orange-400 col-span-1" />
                  <motion.div 
                    className="bg-foreground col-span-1"
                    animate={animation === "idle" ? { scaleY: [1, 0.1, 1] } : {}}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <div className="bg-orange-400 col-span-1" />
                  <div className="bg-pink-300 col-span-2" />
                  <div className="bg-orange-400 col-span-1" />
                  <motion.div 
                    className="bg-foreground col-span-1"
                    animate={animation === "idle" ? { scaleY: [1, 0.1, 1] } : {}}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <div className="bg-orange-400 col-span-1" />
                  
                  {/* Row 5 - Nose/Mouth */}
                  <div className="bg-orange-400 col-span-2" />
                  <div className="bg-orange-400 col-span-1" />
                  <div className={`col-span-2 ${animation === "hungry" ? "bg-gray-400" : animation === "eating" ? "bg-pink-400" : "bg-pink-300"}`} />
                  <div className="bg-orange-400 col-span-1" />
                  <div className="bg-orange-400 col-span-2" />
                  
                  {/* Row 6 - Whiskers */}
                  <div className="bg-orange-400 col-span-8" />
                  
                  {/* Row 7 - Body */}
                  <div className="col-span-1" />
                  <div className="bg-orange-400 col-span-6" />
                  <div className="col-span-1" />
                  
                  {/* Row 8 - Feet */}
                  <div className="col-span-1" />
                  <div className="bg-orange-300 col-span-2" />
                  <div className="bg-orange-400 col-span-2" />
                  <div className="bg-orange-300 col-span-2" />
                  <div className="col-span-1" />
                </div>

                {/* Outfit Overlay */}
                {currentOutfitData && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl">
                    {currentOutfitData.icon}
                  </div>
                )}

                {/* Hungry indicator */}
                {animation === "hungry" && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs"
                  >
                    😢
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
                className="text-center text-[8px] text-primary"
              >
                {logMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Feed Button */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowFoodMenu(!showFoodMenu)}
                className="pixel-btn w-full text-[8px] py-2 bg-orange-500 hover:bg-orange-400"
              >
                <Utensils className="w-3 h-3 inline mr-1" />
                FEED
              </button>

              {/* Food Menu Dropdown */}
              <AnimatePresence>
                {showFoodMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 right-0 mb-1 bg-dialog-bg border-2 border-dialog-border p-2 z-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[7px] text-muted-foreground">INVENTORY</span>
                      <button onClick={() => setShowFoodMenu(false)}>
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                    {petState.foodInventory.filter(f => f.quantity > 0).length === 0 ? (
                      <div className="text-center py-2">
                        <p className="text-[7px] text-muted-foreground mb-2">Kosong!</p>
                        <button
                          onClick={() => { setShowFoodMenu(false); setShowShop(true); }}
                          className="pixel-btn text-[7px] py-1 px-2"
                        >
                          BELI MAKANAN
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {petState.foodInventory.filter(f => f.quantity > 0).map(food => (
                          <button
                            key={food.id}
                            onClick={() => feedPet(food)}
                            className={`w-full flex items-center justify-between p-1 border border-border hover:bg-primary/20 ${
                              food.icon === currentCraving ? "border-gold bg-gold/10" : ""
                            }`}
                          >
                            <span className="text-sm">{food.icon}</span>
                            <span className="text-[7px]">{food.name}</span>
                            <span className="text-[7px] text-muted-foreground">x{food.quantity}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toys Button */}
            <div className="relative flex-1">
              <button
                onClick={() => {
                  const availableToy = petState.toys.find(t => t.quantity > 0);
                  if (availableToy) useToy(availableToy);
                }}
                disabled={!petState.toys.some(t => t.quantity > 0)}
                className="pixel-btn w-full text-[8px] py-2 bg-pink-500 hover:bg-pink-400 disabled:opacity-50"
              >
                🧶 PLAY
              </button>
            </div>

            {/* Shop Button */}
            <button
              onClick={() => setShowShop(true)}
              className="pixel-btn text-[8px] py-2 px-3 bg-gold hover:bg-gold/80"
            >
              <ShoppingBag className="w-3 h-3" />
            </button>
          </div>
        </div>
      </RPGDialog>

      {/* Pet Shop Modal */}
      <PetShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        playerGold={playerGold}
        ownedOutfits={petState.outfits}
        onPurchase={handlePurchase}
        onEquipOutfit={equipOutfit}
      />
    </>
  );
};

export default PetWidget;
