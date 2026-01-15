import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, TrendingUp, TrendingDown, PiggyBank, Target,
  Plus, Calendar, ShoppingBag, Car, Film, Heart, 
  Utensils, GraduationCap, Gift, HelpCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionCategory, TransactionType } from "@/types";

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGold: number;
  onAddTransaction: (transaction: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
  }) => void;
}

const categoryIcons: Record<TransactionCategory, { icon: React.ReactNode; color: string }> = {
  food: { icon: <Utensils className="w-4 h-4" />, color: "text-orange-400" },
  transport: { icon: <Car className="w-4 h-4" />, color: "text-blue-400" },
  entertainment: { icon: <Film className="w-4 h-4" />, color: "text-purple-400" },
  shopping: { icon: <ShoppingBag className="w-4 h-4" />, color: "text-pink-400" },
  bills: { icon: <Calendar className="w-4 h-4" />, color: "text-red-400" },
  health: { icon: <Heart className="w-4 h-4" />, color: "text-green-400" },
  education: { icon: <GraduationCap className="w-4 h-4" />, color: "text-cyan-400" },
  savings: { icon: <PiggyBank className="w-4 h-4" />, color: "text-gold" },
  gift: { icon: <Gift className="w-4 h-4" />, color: "text-secondary" },
  other: { icon: <HelpCircle className="w-4 h-4" />, color: "text-muted-foreground" },
};

const categoryLabels: Record<TransactionCategory, string> = {
  food: "Makanan",
  transport: "Transport",
  entertainment: "Hiburan",
  shopping: "Belanja",
  bills: "Tagihan",
  health: "Kesehatan",
  education: "Pendidikan",
  savings: "Tabungan",
  gift: "Hadiah",
  other: "Lainnya",
};

interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
}

const FinanceModal = ({ isOpen, onClose, userGold, onAddTransaction }: FinanceModalProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("pdq_transactions_display");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<TransactionType>("expense");
  const [newCategory, setNewCategory] = useState<TransactionCategory>("food");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;

  // Category breakdown
  const categoryBreakdown = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<TransactionCategory, number>);

  const handleAddTransaction = () => {
    if (!newAmount || Number(newAmount) <= 0) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newType,
      category: newCategory,
      amount: Number(newAmount),
      description: newDescription || categoryLabels[newCategory],
      date: new Date().toISOString(),
    };

    const updated = [transaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem("pdq_transactions_display", JSON.stringify(updated));
    
    onAddTransaction({
      type: newType,
      category: newCategory,
      amount: Number(newAmount),
      description: newDescription || categoryLabels[newCategory],
    });

    // Reset form
    setNewAmount("");
    setNewDescription("");
    setShowAddForm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-secondary p-0 max-w-lg max-h-[85vh] shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-secondary flex flex-row items-center justify-between">
          <DialogTitle className="text-secondary text-sm flex items-center gap-2">
            <Coins className="w-4 h-4" />
            FINANCE TRACKER
          </DialogTitle>
          <div className="flex items-center gap-2 text-[10px] text-gold">
            💰 {userGold}G
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-3 bg-muted border-b-2 border-border rounded-none p-0">
            <TabsTrigger value="overview" className="text-[9px] py-2 rounded-none data-[state=active]:bg-secondary/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-[9px] py-2 rounded-none data-[state=active]:bg-secondary/20">
              Transaksi
            </TabsTrigger>
            <TabsTrigger value="add" className="text-[9px] py-2 rounded-none data-[state=active]:bg-secondary/20">
              + Tambah
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4 m-0">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-500/10 border-2 border-green-500/50 p-3 text-center">
                <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <div className="text-[8px] text-muted-foreground">Income</div>
                <div className="text-[12px] text-green-400">{totalIncome.toLocaleString()}</div>
              </div>
              <div className="bg-red-500/10 border-2 border-red-500/50 p-3 text-center">
                <TrendingDown className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <div className="text-[8px] text-muted-foreground">Expense</div>
                <div className="text-[12px] text-red-400">{totalExpense.toLocaleString()}</div>
              </div>
              <div className={`${balance >= 0 ? 'bg-gold/10 border-gold/50' : 'bg-red-500/10 border-red-500/50'} border-2 p-3 text-center`}>
                <Coins className={`w-4 h-4 mx-auto mb-1 ${balance >= 0 ? 'text-gold' : 'text-red-400'}`} />
                <div className="text-[8px] text-muted-foreground">Balance</div>
                <div className={`text-[12px] ${balance >= 0 ? 'text-gold' : 'text-red-400'}`}>
                  {balance >= 0 ? '+' : ''}{balance.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="border-2 border-border p-3">
              <h3 className="text-[10px] text-foreground mb-3 flex items-center gap-2">
                <Target className="w-3 h-3" /> Expense by Category
              </h3>
              <div className="space-y-2">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => {
                    const cat = category as TransactionCategory;
                    const percent = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-[8px]">
                          <span className={`flex items-center gap-1 ${categoryIcons[cat].color}`}>
                            {categoryIcons[cat].icon}
                            {categoryLabels[cat]}
                          </span>
                          <span className="text-muted-foreground">{amount.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-muted overflow-hidden">
                          <motion.div
                            className={`h-full ${categoryIcons[cat].color.replace('text-', 'bg-')}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(categoryBreakdown).length === 0 && (
                  <p className="text-[8px] text-muted-foreground text-center py-4">
                    Belum ada data pengeluaran
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="p-4 m-0 max-h-[50vh] overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Coins className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-[10px] text-muted-foreground">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 20).map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-2 border border-border"
                  >
                    <div className={categoryIcons[t.category].color}>
                      {categoryIcons[t.category].icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] text-foreground">{t.description}</div>
                      <div className="text-[7px] text-muted-foreground">
                        {new Date(t.date).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div className={`text-[10px] ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="p-4 m-0">
            <div className="space-y-4">
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNewType("income")}
                  className={`p-3 border-2 transition-all ${
                    newType === "income" 
                      ? "border-green-500 bg-green-500/20" 
                      : "border-border"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <div className="text-[9px] text-foreground">Income</div>
                </button>
                <button
                  onClick={() => setNewType("expense")}
                  className={`p-3 border-2 transition-all ${
                    newType === "expense" 
                      ? "border-red-500 bg-red-500/20" 
                      : "border-border"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-red-400 mx-auto mb-1" />
                  <div className="text-[9px] text-foreground">Expense</div>
                </button>
              </div>

              {/* Category Selection */}
              <div>
                <label className="text-[9px] text-muted-foreground mb-2 block">Kategori</label>
                <div className="grid grid-cols-5 gap-1">
                  {(Object.keys(categoryLabels) as TransactionCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewCategory(cat)}
                      className={`p-2 border transition-all ${
                        newCategory === cat 
                          ? `border-2 ${categoryIcons[cat].color.replace('text-', 'border-')} bg-primary/10` 
                          : "border-border"
                      }`}
                      title={categoryLabels[cat]}
                    >
                      <div className={categoryIcons[cat].color}>
                        {categoryIcons[cat].icon}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-[9px] text-muted-foreground mb-1 block">Jumlah</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-muted border-2 border-border p-2 text-[12px] text-foreground focus:border-secondary outline-none"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[9px] text-muted-foreground mb-1 block">Deskripsi (opsional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-muted border-2 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none"
                  placeholder={categoryLabels[newCategory]}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleAddTransaction}
                disabled={!newAmount || Number(newAmount) <= 0}
                className="w-full pixel-btn-secondary py-3 text-[10px] disabled:opacity-50"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                TAMBAH TRANSAKSI
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FinanceModal;
