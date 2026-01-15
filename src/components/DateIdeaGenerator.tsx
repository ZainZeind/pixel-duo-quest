import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shuffle, Heart, Coffee, Sunset, Mountain, 
  Utensils, Film, Music, Gamepad2, RefreshCw
} from "lucide-react";
import { DateCategory, DateIdea } from "@/types";

interface DateIdeaGeneratorProps {
  onClose?: () => void;
}

const defaultDateIdeas: DateIdea[] = [
  { id: '1', title: 'Picnic di Taman', description: 'Bawa bekal dan selimut, enjoy!', categories: ['outdoor', 'budget'], estimatedCost: 'low', duration: '2-3 jam' },
  { id: '2', title: 'Movie Marathon', description: 'Pilih series/film favorit dan nonton bareng', categories: ['indoor', 'relaxing'], estimatedCost: 'free', duration: '4-6 jam' },
  { id: '3', title: 'Masak Bareng', description: 'Coba resep baru berdua', categories: ['indoor', 'budget'], estimatedCost: 'low', duration: '2-3 jam' },
  { id: '4', title: 'Sunset Watching', description: 'Cari spot bagus untuk lihat matahari terbenam', categories: ['outdoor', 'relaxing'], estimatedCost: 'free', duration: '1-2 jam' },
  { id: '5', title: 'Cafe Hopping', description: 'Explore cafe baru di kota', categories: ['outdoor', 'fancy'], estimatedCost: 'medium', duration: '3-4 jam' },
  { id: '6', title: 'Game Night', description: 'Board games atau video games bareng', categories: ['indoor', 'budget'], estimatedCost: 'free', duration: '2-4 jam' },
  { id: '7', title: 'Hiking Adventure', description: 'Pendakian ringan di gunung terdekat', categories: ['outdoor', 'adventure'], estimatedCost: 'low', duration: '4-6 jam' },
  { id: '8', title: 'Fine Dining', description: 'Dinner romantis di restoran fancy', categories: ['fancy'], estimatedCost: 'high', duration: '2-3 jam' },
  { id: '9', title: 'Stargazing', description: 'Lihat bintang di tempat minim polusi cahaya', categories: ['outdoor', 'relaxing', 'budget'], estimatedCost: 'free', duration: '2-3 jam' },
  { id: '10', title: 'DIY Spa Day', description: 'Face mask, pijatan, dan relaksasi di rumah', categories: ['indoor', 'relaxing'], estimatedCost: 'low', duration: '2-3 jam' },
  { id: '11', title: 'Museum Date', description: 'Explore museum atau galeri seni', categories: ['indoor', 'budget'], estimatedCost: 'low', duration: '2-3 jam' },
  { id: '12', title: 'Beach Day', description: 'Main ke pantai, berenang, dan santai', categories: ['outdoor', 'adventure'], estimatedCost: 'medium', duration: '6-8 jam' },
  { id: '13', title: 'Karaoke Session', description: 'Nyanyi bareng di tempat karaoke', categories: ['indoor'], estimatedCost: 'medium', duration: '2-3 jam' },
  { id: '14', title: 'Pottery Class', description: 'Belajar bikin keramik bareng', categories: ['indoor', 'adventure'], estimatedCost: 'medium', duration: '2-3 jam' },
  { id: '15', title: 'Night Market Explore', description: 'Jajan street food di pasar malam', categories: ['outdoor', 'budget'], estimatedCost: 'low', duration: '2-3 jam' },
];

const categoryIcons: Record<DateCategory, { icon: React.ReactNode; label: string }> = {
  indoor: { icon: <Coffee className="w-4 h-4" />, label: 'Indoor' },
  outdoor: { icon: <Mountain className="w-4 h-4" />, label: 'Outdoor' },
  budget: { icon: <Heart className="w-4 h-4" />, label: 'Budget' },
  fancy: { icon: <Utensils className="w-4 h-4" />, label: 'Fancy' },
  adventure: { icon: <Gamepad2 className="w-4 h-4" />, label: 'Adventure' },
  relaxing: { icon: <Sunset className="w-4 h-4" />, label: 'Relaxing' },
};

const DateIdeaGenerator = ({ onClose }: DateIdeaGeneratorProps) => {
  const [selectedCategories, setSelectedCategories] = useState<DateCategory[]>([]);
  const [currentIdea, setCurrentIdea] = useState<DateIdea | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ideas] = useState<DateIdea[]>(defaultDateIdeas);

  const toggleCategory = (category: DateCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const generateIdea = () => {
    setIsSpinning(true);
    
    // Filter by selected categories
    let filtered = ideas;
    if (selectedCategories.length > 0) {
      filtered = ideas.filter(idea => 
        selectedCategories.some(cat => idea.categories.includes(cat))
      );
    }
    
    if (filtered.length === 0) {
      filtered = ideas;
    }
    
    // Animate through a few ideas
    let count = 0;
    const interval = setInterval(() => {
      const randomIdea = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentIdea(randomIdea);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const getCostColor = (cost: DateIdea['estimatedCost']) => {
    switch (cost) {
      case 'free': return 'text-green-400';
      case 'low': return 'text-cyan-400';
      case 'medium': return 'text-gold';
      case 'high': return 'text-heart';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-4 bg-dialog-bg border-4 border-heart">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heart text-sm flex items-center gap-2">
          <Heart className="w-4 h-4" />
          DATE NIGHT ROULETTE
        </h2>
      </div>

      {/* Category Filters */}
      <div className="mb-4">
        <p className="text-[9px] text-muted-foreground mb-2">Filter by category (optional):</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryIcons) as DateCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-1 px-2 py-1 text-[8px] border transition-all ${
                selectedCategories.includes(cat)
                  ? 'border-heart bg-heart/20 text-heart'
                  : 'border-border text-muted-foreground hover:border-heart/50'
              }`}
            >
              {categoryIcons[cat].icon}
              {categoryIcons[cat].label}
            </button>
          ))}
        </div>
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={generateIdea}
        disabled={isSpinning}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 border-4 mb-4 flex items-center justify-center gap-2 ${
          isSpinning 
            ? 'border-border bg-muted text-muted-foreground' 
            : 'border-heart bg-heart/10 text-heart hover:bg-heart/20'
        }`}
      >
        <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
        <span className="text-sm">{isSpinning ? 'SPINNING...' : 'GENERATE DATE IDEA!'}</span>
      </motion.button>

      {/* Result */}
      <AnimatePresence mode="wait">
        {currentIdea && (
          <motion.div
            key={currentIdea.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 border-4 border-heart bg-gradient-to-br from-heart/10 to-primary/10"
          >
            <div className="text-center mb-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-4xl mb-2"
              >
                💕
              </motion.div>
              <h3 className="text-lg text-foreground mb-1">{currentIdea.title}</h3>
              <p className="text-[10px] text-muted-foreground">{currentIdea.description}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-background/50 border border-border">
                <div className="text-[8px] text-muted-foreground">Duration</div>
                <div className="text-[10px] text-foreground">{currentIdea.duration}</div>
              </div>
              <div className="p-2 bg-background/50 border border-border">
                <div className="text-[8px] text-muted-foreground">Cost</div>
                <div className={`text-[10px] ${getCostColor(currentIdea.estimatedCost)}`}>
                  {currentIdea.estimatedCost === 'free' ? 'FREE!' : currentIdea.estimatedCost.toUpperCase()}
                </div>
              </div>
              <div className="p-2 bg-background/50 border border-border">
                <div className="text-[8px] text-muted-foreground">Type</div>
                <div className="text-[10px] text-foreground">
                  {currentIdea.categories.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>

            <button
              onClick={generateIdea}
              className="w-full mt-3 py-2 text-[9px] text-heart border border-heart hover:bg-heart/10"
            >
              <Shuffle className="w-3 h-3 inline mr-1" />
              TRY ANOTHER
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentIdea && (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-[10px] text-muted-foreground">
            Click the button to get a random date idea!
          </p>
        </div>
      )}
    </div>
  );
};

export default DateIdeaGenerator;
