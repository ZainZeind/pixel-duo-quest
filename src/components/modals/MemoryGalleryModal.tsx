import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, Image, Plus, X, Heart, Calendar as CalendarIcon,
  Grid, List
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Memory } from "@/types";

interface MemoryGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onDeleteMemory: (id: string) => void;
}

const frameStyles = [
  { id: 'pixel', name: 'Pixel', border: 'border-4 border-primary' },
  { id: 'heart', name: 'Heart', border: 'border-4 border-heart' },
  { id: 'gold', name: 'Gold', border: 'border-4 border-gold' },
  { id: 'simple', name: 'Simple', border: 'border-2 border-border' },
  { id: 'double', name: 'Double', border: 'border-4 border-double border-secondary' },
];

const MemoryGalleryModal = ({ isOpen, onClose, memories, onAddMemory, onDeleteMemory }: MemoryGalleryModalProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [newCaption, setNewCaption] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFrame, setNewFrame] = useState("pixel");
  const [newImageData, setNewImageData] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = () => {
    if (!newImageData || !newCaption) return;
    
    onAddMemory({
      imageData: newImageData,
      caption: newCaption,
      date: newDate,
      frameStyle: newFrame,
      createdBy: 'user',
    });
    
    // Reset form
    setNewCaption("");
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewFrame("pixel");
    setNewImageData(null);
    setShowAddForm(false);
  };

  const getFrameClass = (frameId: string) => {
    return frameStyles.find(f => f.id === frameId)?.border || frameStyles[0].border;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-heart p-0 max-w-2xl max-h-[85vh] shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-heart flex flex-row items-center justify-between">
          <DialogTitle className="text-heart text-sm flex items-center gap-2">
            <Camera className="w-4 h-4" />
            MEMORY GALLERY
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 border ${viewMode === 'grid' ? 'border-heart bg-heart/20' : 'border-border'}`}
            >
              <Grid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 border ${viewMode === 'timeline' ? 'border-heart bg-heart/20' : 'border-border'}`}
            >
              <List className="w-3 h-3" />
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="pixel-btn text-[8px] py-1 px-2 bg-heart hover:bg-heart/80"
            >
              <Plus className="w-3 h-3 inline" /> ADD
            </button>
          </div>
        </DialogHeader>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Add Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-4 border-2 border-dashed border-heart bg-heart/5"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Image Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {newImageData ? (
                      <div className="relative">
                        <img 
                          src={newImageData} 
                          alt="Preview" 
                          className={`w-full h-40 object-cover ${getFrameClass(newFrame)}`}
                        />
                        <button
                          onClick={() => setNewImageData(null)}
                          className="absolute top-1 right-1 bg-background p-1 border border-border"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-heart transition-colors"
                      >
                        <Image className="w-8 h-8 text-muted-foreground" />
                        <span className="text-[9px] text-muted-foreground">Click to upload</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] text-muted-foreground mb-1 block">Caption</label>
                      <input
                        type="text"
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        className="w-full bg-muted border border-border p-1.5 text-[10px]"
                        placeholder="Our special moment..."
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground mb-1 block">Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-muted border border-border p-1.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground mb-1 block">Frame</label>
                      <div className="flex gap-1">
                        {frameStyles.map(frame => (
                          <button
                            key={frame.id}
                            onClick={() => setNewFrame(frame.id)}
                            className={`flex-1 p-1.5 text-[7px] ${frame.border} ${
                              newFrame === frame.id ? 'bg-primary/20' : 'bg-muted'
                            }`}
                          >
                            {frame.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleAddMemory}
                      disabled={!newImageData || !newCaption}
                      className="w-full pixel-btn-primary py-2 text-[9px] disabled:opacity-50"
                    >
                      SAVE MEMORY
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gallery */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-3">
              {memories.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-[10px] text-muted-foreground">No memories yet</p>
                  <p className="text-[8px] text-muted-foreground mt-1">Upload your first memory together!</p>
                </div>
              ) : (
                memories.map((memory) => (
                  <motion.div
                    key={memory.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMemory(memory)}
                    className={`cursor-pointer ${getFrameClass(memory.frameStyle)} bg-background`}
                  >
                    <img 
                      src={memory.imageData} 
                      alt={memory.caption} 
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-1.5 bg-muted">
                      <p className="text-[8px] text-foreground truncate">{memory.caption}</p>
                      <p className="text-[6px] text-muted-foreground">
                        {new Date(memory.date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {memories
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-heart" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className={`flex-1 ${getFrameClass(memory.frameStyle)} bg-background`}>
                      <img 
                        src={memory.imageData} 
                        alt={memory.caption} 
                        className="w-full h-32 object-cover cursor-pointer"
                        onClick={() => setSelectedMemory(memory)}
                      />
                      <div className="p-2">
                        <div className="flex items-center gap-2 text-[8px] text-muted-foreground mb-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(memory.date).toLocaleDateString('id-ID', { 
                            day: 'numeric', month: 'long', year: 'numeric' 
                          })}
                        </div>
                        <p className="text-[10px] text-foreground">{memory.caption}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>

        {/* Fullscreen View */}
        <AnimatePresence>
          {selectedMemory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-8"
              onClick={() => setSelectedMemory(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className={`max-w-xl ${getFrameClass(selectedMemory.frameStyle)} bg-background`}
                onClick={e => e.stopPropagation()}
              >
                <img 
                  src={selectedMemory.imageData} 
                  alt={selectedMemory.caption} 
                  className="w-full object-contain max-h-[60vh]"
                />
                <div className="p-4">
                  <p className="text-foreground text-sm">{selectedMemory.caption}</p>
                  <p className="text-muted-foreground text-[10px] mt-1">
                    {new Date(selectedMemory.date).toLocaleDateString('id-ID', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-2 right-2 p-2 bg-background border border-border"
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

export default MemoryGalleryModal;
