import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, ShoppingBag, Package, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerGold: number;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
  owned: number;
}

const shopItems: ShopItem[] = [
  { id: "1", name: "Voucher Pijat", price: 500, icon: "💆", description: "Pijat 30 menit gratis!", owned: 0 },
  { id: "2", name: "Tiket Nonton", price: 1000, icon: "🎬", description: "Bebas pilih film!", owned: 0 },
  { id: "3", name: "Skip Cuci Piring", price: 300, icon: "🍽️", description: "Bebas cuci 1x", owned: 0 },
  { id: "4", name: "Kartu Anti Marah", price: 750, icon: "😇", description: "1 jam bebas dimarahin", owned: 0 },
  { id: "5", name: "Request Makanan", price: 400, icon: "🍕", description: "Minta dibelikan makan", owned: 0 },
  { id: "6", name: "Voucher Peluk", price: 200, icon: "🤗", description: "Peluk 5 menit", owned: 0 },
];

const ShopModal = ({ isOpen, onClose, playerGold }: ShopModalProps) => {
  const [gold, setGold] = useState(playerGold);
  const [inventory, setInventory] = useState<ShopItem[]>([]);
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);

  const handleBuy = (item: ShopItem) => {
    if (gold >= item.price) {
      setGold(gold - item.price);
      setPurchaseAnimation(item.id);
      setTimeout(() => setPurchaseAnimation(null), 500);
      
      const existingItem = inventory.find(i => i.id === item.id);
      if (existingItem) {
        setInventory(inventory.map(i => 
          i.id === item.id ? { ...i, owned: i.owned + 1 } : i
        ));
      } else {
        setInventory([...inventory, { ...item, owned: 1 }]);
      }
    }
  };

  const handleUse = (itemId: string) => {
    setInventory(inventory.map(i => 
      i.id === itemId ? { ...i, owned: i.owned - 1 } : i
    ).filter(i => i.owned > 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-secondary p-0 max-w-lg shadow-[4px_4px_0_hsl(var(--pixel-shadow)),inset_-4px_-4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-secondary flex flex-row items-center justify-between">
          <DialogTitle className="text-secondary text-sm">
            MARKETPLACE
          </DialogTitle>
          <div className="flex items-center gap-2 bg-muted px-3 py-1 border-2 border-primary">
            <Coins className="w-4 h-4 text-gold" />
            <span className="text-[10px] text-gold">{gold}G</span>
          </div>
        </DialogHeader>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-muted border-b-4 border-border rounded-none p-0">
            <TabsTrigger 
              value="buy" 
              className="text-[10px] py-3 rounded-none data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground border-r-2 border-border"
            >
              <ShoppingBag className="w-3 h-3 mr-2" />
              BELI ITEM
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="text-[10px] py-3 rounded-none data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              <Package className="w-3 h-3 mr-2" />
              TAS SAYA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="p-4 max-h-[50vh] overflow-y-auto m-0">
            <div className="grid grid-cols-2 gap-3">
              {shopItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={cn(
                    "bg-muted border-4 border-border p-3 transition-all hover:border-secondary",
                    purchaseAnimation === item.id && "shake"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-2xl text-center mb-2">{item.icon}</div>
                  <h3 className="text-[8px] text-foreground text-center mb-1">{item.name}</h3>
                  <p className="text-[6px] text-muted-foreground text-center mb-2">{item.description}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Coins className="w-3 h-3 text-gold" />
                    <span className="text-[8px] text-gold">{item.price}G</span>
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={gold < item.price}
                    className={cn(
                      "w-full text-[8px] py-1 border-2 transition-all",
                      gold >= item.price
                        ? "bg-hp-bar/20 border-hp-bar text-hp-bar hover:bg-hp-bar/30"
                        : "bg-muted border-border text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {gold >= item.price ? "BELI" : "KURANG G"}
                  </button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="p-4 max-h-[50vh] overflow-y-auto m-0">
            {inventory.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground">Tas kosong...</p>
                <p className="text-[8px] text-muted-foreground mt-1">Beli item di tab "BELI ITEM"</p>
              </div>
            ) : (
              <div className="space-y-2">
                {inventory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-muted border-4 border-border p-3 flex items-center gap-3"
                  >
                    <div className="text-xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-[8px] text-foreground">{item.name}</h3>
                      <p className="text-[6px] text-muted-foreground">x{item.owned}</p>
                    </div>
                    <button
                      onClick={() => handleUse(item.id)}
                      className="text-[8px] px-3 py-1 bg-accent/20 border-2 border-accent text-accent hover:bg-accent/30 transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      GUNAKAN
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
