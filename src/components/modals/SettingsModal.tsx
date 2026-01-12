import { useState } from "react";
import { motion } from "framer-motion";
import { User, Link2, Settings, Volume2, VolumeX, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const avatarOptions = ["🧙", "🧝", "🦊", "🐱", "🐻", "🐰", "🎮", "👾", "🤖", "👽"];

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [displayName, setDisplayName] = useState("Hero");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [partnerCode, setPartnerCode] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const handlePrevAvatar = () => {
    setAvatarIndex((prev) => (prev === 0 ? avatarOptions.length - 1 : prev - 1));
  };

  const handleNextAvatar = () => {
    setAvatarIndex((prev) => (prev === avatarOptions.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-muted-foreground p-0 max-w-md shadow-[4px_4px_0_hsl(var(--pixel-shadow)),inset_-4px_-4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-muted-foreground">
          <DialogTitle className="text-foreground text-sm text-center flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            PENGATURAN
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-border pb-2">
              <User className="w-4 h-4 text-secondary" />
              <span className="text-[10px] text-secondary">PROFIL</span>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-[8px] text-muted-foreground">NAMA TAMPILAN</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-muted border-4 border-border p-2 text-[10px] text-foreground focus:border-secondary outline-none transition-colors"
                placeholder="Nama kamu..."
              />
            </div>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="text-[8px] text-muted-foreground">AVATAR</label>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevAvatar}
                  className="p-2 bg-muted border-2 border-border hover:border-secondary transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                
                <motion.div
                  key={avatarIndex}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-muted border-4 border-secondary flex items-center justify-center"
                >
                  <span className="text-3xl">{avatarOptions[avatarIndex]}</span>
                </motion.div>
                
                <button
                  onClick={handleNextAvatar}
                  className="p-2 bg-muted border-2 border-border hover:border-secondary transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </div>
              <p className="text-[8px] text-center text-muted-foreground">
                {avatarIndex + 1} / {avatarOptions.length}
              </p>
            </div>
          </div>

          {/* Section 2: Partner Connection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-border pb-2">
              <Link2 className="w-4 h-4 text-accent" />
              <span className="text-[10px] text-accent">KONEKSI PACAR</span>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between bg-muted border-2 border-border p-3">
              <span className="text-[8px] text-muted-foreground">STATUS</span>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 bg-hp-bar rounded-full animate-pulse" />
                    <span className="text-[10px] text-hp-bar">TERHUBUNG</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-destructive rounded-full" />
                    <span className="text-[10px] text-destructive">TERPUTUS</span>
                  </>
                )}
              </div>
            </div>

            {/* Partner Code */}
            <div className="space-y-2">
              <label className="text-[8px] text-muted-foreground">KODE PASANGAN</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-muted border-4 border-border p-2 text-[10px] text-foreground focus:border-accent outline-none transition-colors tracking-widest"
                  placeholder="XXXX-XXXX"
                  maxLength={9}
                />
                <button
                  onClick={() => setIsConnected(!isConnected)}
                  className={cn(
                    "px-3 border-4 text-[8px] transition-all",
                    isConnected
                      ? "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30"
                      : "bg-hp-bar/20 border-hp-bar text-hp-bar hover:bg-hp-bar/30"
                  )}
                >
                  {isConnected ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[6px] text-muted-foreground">
                Masukkan kode dari pasanganmu untuk menghubungkan akun
              </p>
            </div>

            {/* Your Code */}
            <div className="bg-muted/50 border-2 border-dashed border-border p-3 text-center">
              <p className="text-[8px] text-muted-foreground mb-1">KODE KAMU</p>
              <p className="text-sm text-primary tracking-widest">LOVE-2024</p>
              <p className="text-[6px] text-muted-foreground mt-1">Bagikan ke pasanganmu!</p>
            </div>
          </div>

          {/* Section 3: System */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-border pb-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">SISTEM</span>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between bg-muted border-2 border-border p-3">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-foreground" />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-[10px] text-foreground">EFEK SUARA</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  "w-12 h-6 border-2 relative transition-all",
                  soundEnabled ? "bg-hp-bar/20 border-hp-bar" : "bg-muted border-border"
                )}
              >
                <motion.div
                  className={cn(
                    "absolute top-0 w-5 h-5 border-2",
                    soundEnabled ? "bg-hp-bar border-hp-bar" : "bg-muted-foreground border-border"
                  )}
                  animate={{ left: soundEnabled ? "calc(100% - 20px)" : "0px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Music Toggle */}
            <div className="flex items-center justify-between bg-muted border-2 border-border p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{musicEnabled ? "🎵" : "🔇"}</span>
                <span className="text-[10px] text-foreground">MUSIK</span>
              </div>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={cn(
                  "w-12 h-6 border-2 relative transition-all",
                  musicEnabled ? "bg-hp-bar/20 border-hp-bar" : "bg-muted border-border"
                )}
              >
                <motion.div
                  className={cn(
                    "absolute top-0 w-5 h-5 border-2",
                    musicEnabled ? "bg-hp-bar border-hp-bar" : "bg-muted-foreground border-border"
                  )}
                  animate={{ left: musicEnabled ? "calc(100% - 20px)" : "0px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t-4 border-muted-foreground">
          <button
            onClick={onClose}
            className="w-full pixel-btn-primary text-[10px]"
          >
            SIMPAN & TUTUP
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
