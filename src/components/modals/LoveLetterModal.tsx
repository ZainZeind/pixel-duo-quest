import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Send, Lock, Eye, EyeOff, Heart, X, Plus,
  Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoveLetter } from "@/types";

interface LoveLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: LoveLetter[];
  currentUserId: string;
  partnerName?: string;
  onSendLetter: (letter: Omit<LoveLetter, 'id' | 'createdAt' | 'isOpened'>) => void;
  onOpenLetter: (id: string) => void;
}

const LoveLetterModal = ({ 
  isOpen, 
  onClose, 
  letters, 
  currentUserId,
  partnerName = "Partner",
  onSendLetter,
  onOpenLetter
}: LoveLetterModalProps) => {
  const [showCompose, setShowCompose] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [revealDate, setRevealDate] = useState("");

  const receivedLetters = letters.filter(l => l.receiverId === currentUserId);
  const sentLetters = letters.filter(l => l.senderId === currentUserId);
  const unreadCount = receivedLetters.filter(l => !l.isOpened).length;

  const handleSend = () => {
    if (!content.trim()) return;
    
    onSendLetter({
      senderId: currentUserId,
      receiverId: 'partner', // Will be replaced with actual partner ID
      content: content,
      isSecret,
      revealDate: isSecret && revealDate ? revealDate : undefined,
    });
    
    setContent("");
    setIsSecret(false);
    setRevealDate("");
    setShowCompose(false);
  };

  const canOpenLetter = (letter: LoveLetter) => {
    if (!letter.isSecret) return true;
    if (!letter.revealDate) return true;
    return new Date(letter.revealDate) <= new Date();
  };

  const handleOpenLetter = (letter: LoveLetter) => {
    if (!canOpenLetter(letter)) return;
    
    if (!letter.isOpened) {
      onOpenLetter(letter.id);
    }
    setSelectedLetter(letter);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-heart p-0 max-w-lg max-h-[85vh] shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-heart flex flex-row items-center justify-between">
          <DialogTitle className="text-heart text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            LOVE LETTERS
            {unreadCount > 0 && (
              <span className="bg-heart text-white text-[8px] px-1.5 py-0.5 rounded">
                {unreadCount} NEW
              </span>
            )}
          </DialogTitle>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="pixel-btn text-[8px] py-1 px-2 bg-heart hover:bg-heart/80"
          >
            <Plus className="w-3 h-3 inline" /> WRITE
          </button>
        </DialogHeader>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Compose Form */}
          <AnimatePresence>
            {showCompose && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-4 border-2 border-heart bg-heart/5 space-y-3"
              >
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Send className="w-3 h-3" />
                  To: {partnerName}
                </div>
                
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your love letter..."
                  className="w-full h-32 bg-muted border border-border p-2 text-[10px] resize-none"
                />
                
                {/* Secret Letter Option */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[9px] text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSecret}
                      onChange={(e) => setIsSecret(e.target.checked)}
                      className="w-3 h-3"
                    />
                    <Lock className="w-3 h-3" />
                    Secret Letter
                  </label>
                  
                  {isSecret && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <input
                        type="date"
                        value={revealDate}
                        onChange={(e) => setRevealDate(e.target.value)}
                        className="bg-muted border border-border p-1 text-[9px]"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSend}
                  disabled={!content.trim()}
                  className="w-full pixel-btn-primary py-2 text-[9px] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3 h-3" />
                  SEND LETTER
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Received Letters */}
          <div className="mb-4">
            <h3 className="text-[10px] text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Received ({receivedLetters.length})
            </h3>
            <div className="space-y-2">
              {receivedLetters.length === 0 ? (
                <p className="text-[9px] text-muted-foreground text-center py-4">
                  No letters received yet
                </p>
              ) : (
                receivedLetters.map(letter => {
                  const canOpen = canOpenLetter(letter);
                  return (
                    <motion.button
                      key={letter.id}
                      onClick={() => handleOpenLetter(letter)}
                      whileHover={canOpen ? { scale: 1.01 } : {}}
                      disabled={!canOpen}
                      className={`w-full p-3 border-2 text-left transition-all ${
                        !letter.isOpened 
                          ? 'border-heart bg-heart/10' 
                          : 'border-border bg-muted/30'
                      } ${!canOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {letter.isSecret && !canOpen ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : letter.isOpened ? (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Mail className="w-4 h-4 text-heart" />
                          )}
                          <div>
                            <span className="text-[9px] text-foreground">
                              {letter.isSecret && !canOpen 
                                ? `Secret Message (opens ${new Date(letter.revealDate!).toLocaleDateString('id-ID')})`
                                : letter.content.substring(0, 30) + (letter.content.length > 30 ? '...' : '')
                              }
                            </span>
                            <div className="text-[7px] text-muted-foreground">
                              {new Date(letter.createdAt).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                        {!letter.isOpened && canOpen && (
                          <span className="text-[7px] text-heart">NEW</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

          {/* Sent Letters */}
          <div>
            <h3 className="text-[10px] text-foreground mb-2 flex items-center gap-2">
              <Send className="w-3 h-3" /> Sent ({sentLetters.length})
            </h3>
            <div className="space-y-2">
              {sentLetters.length === 0 ? (
                <p className="text-[9px] text-muted-foreground text-center py-4">
                  No letters sent yet. Write one!
                </p>
              ) : (
                sentLetters.map(letter => (
                  <div
                    key={letter.id}
                    className="p-2 border border-border bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <Send className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[8px] text-muted-foreground">
                        {letter.content.substring(0, 40)}...
                      </span>
                      {letter.isSecret && <Lock className="w-3 h-3 text-muted-foreground" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Letter Viewer */}
        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-8"
              onClick={() => setSelectedLetter(null)}
            >
              <motion.div
                initial={{ scale: 0.9, rotate: -2 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.9, rotate: 2 }}
                className="max-w-md w-full bg-[#FFF8E7] p-8 border-4 border-heart shadow-lg"
                onClick={e => e.stopPropagation()}
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #E5D5C3 31px, #E5D5C3 32px)',
                }}
              >
                <div className="text-center mb-6">
                  <Heart className="w-8 h-8 text-heart mx-auto mb-2" />
                  <p className="text-[8px] text-[#8B7355]">
                    {new Date(selectedLetter.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                
                <p className="text-[#5C4033] text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedLetter.content}
                </p>
                
                <div className="mt-8 text-right">
                  <p className="text-[12px] text-[#8B7355] italic">With love ❤️</p>
                </div>

                <button
                  onClick={() => setSelectedLetter(null)}
                  className="absolute top-2 right-2 p-2 text-[#8B7355] hover:text-heart"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default LoveLetterModal;
