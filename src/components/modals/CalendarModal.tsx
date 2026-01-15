import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, ChevronLeft, ChevronRight, Heart, Star, 
  Gift, PartyPopper, Plus, Bell
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEvent, EventType } from "@/types";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  anniversaryDate?: string;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

const eventTypeInfo: Record<EventType, { icon: string; color: string }> = {
  anniversary: { icon: "💕", color: "text-heart" },
  birthday: { icon: "🎂", color: "text-gold" },
  date: { icon: "🌹", color: "text-pink-400" },
  reminder: { icon: "📝", color: "text-primary" },
  milestone: { icon: "🏆", color: "text-secondary" },
};

const CalendarModal = ({ isOpen, onClose, anniversaryDate, events, onAddEvent }: CalendarModalProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<EventType>("reminder");
  const [newEventDate, setNewEventDate] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate days until anniversary
  let daysUntilAnniversary = 0;
  if (anniversaryDate) {
    const anniv = new Date(anniversaryDate);
    const today = new Date();
    const thisYearAnniv = new Date(today.getFullYear(), anniv.getMonth(), anniv.getDate());
    if (thisYearAnniv < today) {
      thisYearAnniv.setFullYear(today.getFullYear() + 1);
    }
    daysUntilAnniversary = Math.ceil((thisYearAnniv.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date.startsWith(dateStr));
  };

  const handleAddEvent = () => {
    if (!newTitle || !newEventDate) return;
    
    onAddEvent({
      title: newTitle,
      date: newEventDate,
      type: newType,
      createdBy: 'user',
    });
    
    setNewTitle("");
    setNewEventDate("");
    setShowAddForm(false);
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    // Empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year;
      const dayEvents = getEventsForDay(day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setSelectedDate(dateStr);
            setNewEventDate(dateStr);
          }}
          className={`h-8 relative flex items-center justify-center text-[10px] border transition-all
            ${isToday ? 'border-primary bg-primary/20 text-primary' : 'border-transparent hover:border-border'}
            ${selectedDate === dateStr ? 'border-secondary bg-secondary/20' : ''}
          `}
        >
          {day}
          {dayEvents.length > 0 && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
              {dayEvents.slice(0, 3).map((e, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full ${eventTypeInfo[e.type].color.replace('text-', 'bg-')}`} 
                />
              ))}
            </div>
          )}
        </motion.button>
      );
    }
    
    return days;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dialog-bg border-4 border-primary p-0 max-w-lg max-h-[85vh] shadow-[4px_4px_0_hsl(var(--pixel-shadow))]">
        <DialogHeader className="p-4 border-b-4 border-primary flex flex-row items-center justify-between">
          <DialogTitle className="text-primary text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            CALENDAR
          </DialogTitle>
          {anniversaryDate && (
            <div className="flex items-center gap-2 text-[10px]">
              <Heart className="w-3 h-3 text-heart" />
              <span className="text-heart">{daysUntilAnniversary} days until anniversary!</span>
            </div>
          )}
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="p-1 hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[12px] text-foreground">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="p-1 hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="border-2 border-border p-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-[8px] text-muted-foreground text-center">
                  {day}
                </div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="border-2 border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-foreground">
                  {new Date(selectedDate).toLocaleDateString('id-ID', { 
                    weekday: 'long', day: 'numeric', month: 'long' 
                  })}
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-[8px] text-primary flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Event
                </button>
              </div>
              
              {showAddForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-2 mb-3 p-2 bg-muted"
                >
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Event title..."
                    className="w-full bg-background border border-border p-1.5 text-[9px]"
                  />
                  <div className="flex gap-1">
                    {(Object.keys(eventTypeInfo) as EventType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewType(type)}
                        className={`p-1.5 border ${newType === type ? 'border-primary bg-primary/20' : 'border-border'}`}
                      >
                        <span className="text-sm">{eventTypeInfo[type].icon}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleAddEvent}
                    className="w-full pixel-btn-primary py-1 text-[8px]"
                  >
                    ADD
                  </button>
                </motion.div>
              )}
              
              {getEventsForDay(parseInt(selectedDate.split('-')[2])).length === 0 && !showAddForm && (
                <p className="text-[9px] text-muted-foreground text-center py-2">
                  No events on this day
                </p>
              )}
              
              {getEventsForDay(parseInt(selectedDate.split('-')[2])).map((event, i) => (
                <div key={i} className="flex items-center gap-2 py-1 border-b border-border last:border-0">
                  <span>{eventTypeInfo[event.type].icon}</span>
                  <span className="text-[9px] text-foreground">{event.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="border-2 border-border p-3">
            <h3 className="text-[10px] text-foreground mb-2 flex items-center gap-2">
              <Bell className="w-3 h-3" /> Upcoming Events
            </h3>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {events
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event, i) => (
                  <div key={i} className="flex items-center justify-between text-[8px]">
                    <div className="flex items-center gap-1">
                      <span>{eventTypeInfo[event.type].icon}</span>
                      <span className="text-foreground">{event.title}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
                <p className="text-[8px] text-muted-foreground text-center">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;
