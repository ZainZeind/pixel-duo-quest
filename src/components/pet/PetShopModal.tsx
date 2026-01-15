import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, ShoppingBag, Shirt, Sparkles } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  hungerValue?: number;
  happinessValue?: number;
}

interface Outfit {
  id: string;
  name: string;
  icon: string;
  equipped: boolean;
}

interface PetShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerGold: number;
  ownedOutfits: Outfit[];
  onPurchase: (type: "food" | "outfit" | "toy", item: ShopItem) => void;
  onEquipOutfit: (outfitId: string) => void;
}

const foodItems: ShopItem[] = [
  { id: "fish", name: "Ikan", icon: "🐟", price: 30, hungerValue: 20 },
  { id: "milk", name: "Susu", icon: "🥛", price: 20, hungerValue: 15 },
  { id: "tuna", name: "Tuna", icon: "🐠", price: 50, hungerValue: 30 },
  { id: "salmon", name: "Premium Salmon", icon: "🍣", price: 100, hungerValue: 50 },
  { id: "chicken", name: "Ayam", icon: "🍗", price: 40, hungerValue: 25 },
  { id: "treats", name: "Snack Kucing", icon: "🍪", price: 15, hungerValue: 10 },
];

const outfitItems: ShopItem[] = [
  { id: "wizard_hat", name: "Topi Penyihir", icon: "🧙", price: 200 },
  { id: "sunglasses", name: "Kacamata Hitam", icon: "😎", price: 150 },
  { id: "crown", name: "Mahkota", icon: "👑", price: 500 },
  { id: "bowtie", name: "Dasi Kupu", icon: "🎀", price: 100 },
  { id: "scarf", name: "Syal Merah", icon: "🧣", price: 120 },
  { id: "party_hat", name: "Topi Pesta", icon: "🎉", price: 80 },
];

const toyItems: ShopItem[] = [
  { id: "yarn", name: "Bola Benang", icon: "🧶", price: 50, happinessValue: 15 },
  { id: "box", name: "Kardus Box", icon: "📦", price: 30, happinessValue: 10 },
  { id: "mouse", name: "Tikus Mainan", icon: "🐭", price: 60, happinessValue: 20 },
  { id: "laser", name: "Laser Pointer", icon: "🔴", price: 100, happinessValue: 30 },
  { id: "feather", name: "Tongkat Bulu", icon: "🪶", price: 40, happinessValue: 12 },
];

const PetShopModal = ({ 
  isOpen, 
  onClose, 
  playerGold, 
  ownedOutfits, 
  onPurchase,
  onEquipOutfit 
}: PetShopModalProps) => {
  const [activeTab, setActiveTab] = useState<"food" | "outfit" | "toy">("food");

  const tabs = [
    { id: "food" as const, label: "FOOD", icon: <ShoppingBag className="w-3 h-3" /> },
    { id: "outfit" as const, label: "OUTFITS", icon: <Shirt className="w-3 h-3" /> },
    { id: "toy" as const, label: "TOYS", icon: <Sparkles className="w-3 h-3" /> },
  ];

  const renderItems = () => {
    const items = activeTab === "food" ? foodItems : activeTab === "outfit" ? outfitItems : toyItems;

    return (
      <div className="grid grid-cols-2 gap-2">
        {items.map(item => {
          const isOwned = activeTab === "outfit" && ownedOutfits.some(o => o.id === item.id);
          const isEquipped = activeTab === "outfit" && ownedOutfits.find(o => o.id === item.id)?.equipped;
          const canAfford = playerGold >= item.price;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className={`
                bg-background/30 border-2 p-2 
                ${isEquipped ? "border-primary" : "border-border"}
              `}
            >
              <div className="text-center mb-2">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <p className="text-[7px] text-center text-foreground mb-1">{item.name}</p>
              
              {activeTab === "food" && (
                <p className="text-[6px] text-center text-orange-400 mb-1">
                  +{item.hungerValue} Hunger
                </p>
              )}
              {activeTab === "toy" && (
                <p className="text-[6px] text-center text-pink-400 mb-1">
                  +{item.happinessValue} Happy
                </p>
              )}

              {isOwned ? (
                <button
                  onClick={() => onEquipOutfit(item.id)}
                  className={`
                    w-full text-[7px] py-1 border-2
                    ${isEquipped 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-transparent text-primary border-primary hover:bg-primary/20"
                    }
                  `}
                >
                  {isEquipped ? "EQUIPPED" : "EQUIP"}
                </button>
              ) : (
                <button
                  onClick={() => onPurchase(activeTab, item)}
                  disabled={!canAfford}
                  className={`
                    w-full text-[7px] py-1 flex items-center justify-center gap-1
                    ${canAfford 
                      ? "pixel-btn" 
                      : "bg-muted text-muted-foreground cursor-not-allowed border-2 border-muted"
                    }
                  `}
                >
                  <Coins className="w-2 h-2" />
                  {item.price}G
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-dialog-bg border-4 border-dialog-border p-4"
            style={{
              boxShadow: `
                inset -4px -4px 0 hsl(var(--pixel-shadow)),
                4px 4px 0 hsl(var(--pixel-shadow))
              `,
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] text-primary">🐱 PET SHOP</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gold/20 px-2 py-1 border border-gold">
                  <Coins className="w-3 h-3 text-gold" />
                  <span className="text-[8px] text-gold font-bold">{playerGold}G</span>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-1 py-2 text-[7px] border-2 transition-all
                    ${activeTab === tab.id 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {renderItems()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PetShopModal;
