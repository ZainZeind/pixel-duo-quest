import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);
    
    // Phase timing
    const phases = [
      { duration: 800, nextPhase: 1 },   // Boot screen
      { duration: 1500, nextPhase: 2 },  // Loading
      { duration: 1200, nextPhase: 3 },  // Logo reveal
      { duration: 1500, nextPhase: 4 },  // Final transition
      { duration: 500, nextPhase: -1 },  // Complete
    ];

    const timer = setTimeout(() => {
      if (phase < phases.length && phases[phase]) {
        if (phases[phase].nextPhase === -1) {
          onComplete();
        } else {
          setPhase(phases[phase].nextPhase);
        }
      }
    }, phases[phase]?.duration || 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(skipTimer);
    };
  }, [phase, onComplete]);

  // Loading progress animation
  useEffect(() => {
    if (phase === 1) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-[#0a0a0f] overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* CRT Scanlines Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          }}
        />
        
        {/* CRT Flicker */}
        <motion.div
          className="absolute inset-0 bg-white/[0.02] pointer-events-none z-40"
          animate={{ opacity: [0.02, 0.04, 0.02, 0.03, 0.02] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />

        {/* Vignette Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Phase 0: Boot Screen */}
        {phase === 0 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="text-green-500 font-mono text-[10px] md:text-xs space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TypewriterText text="ZEIND-ALA ENTERTAINMENT SYSTEM" delay={0} />
              <TypewriterText text="© 2026 COUPLE QUEST CORP." delay={300} />
              <TypewriterText text="INITIALIZING LOVE MODULE..." delay={600} />
              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="animate-pulse">█</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 1: Loading */}
        {phase === 1 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Pixel Particles */}
            <PixelParticles />
            
            <div className="text-center z-10">
              <motion.p
                className="text-primary font-pixel text-lg mb-8"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                LOADING ADVENTURE
              </motion.p>
              
              {/* Pixel Loading Bar */}
              <div className="w-64 h-6 border-4 border-primary bg-black relative overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
                {/* Pixel segments */}
                <div className="absolute inset-0 flex">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-black/50" />
                  ))}
                </div>
              </div>
              
              <p className="text-[10px] text-muted-foreground mt-4 font-mono">
                {Math.min(Math.round(loadingProgress), 100)}% COMPLETE
              </p>
            </div>
          </motion.div>
        )}

        {/* Phase 2: Logo Reveal with Glitch */}
        {phase === 2 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlitchLogo />
          </motion.div>
        )}

        {/* Phase 3: Welcome Message */}
        {phase === 3 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <motion.div
              className="text-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <img 
                src="/logo.png" 
                alt="Zeind & Ala" 
                className="w-32 h-32 mx-auto mb-6"
              />
              <h1 className="text-3xl md:text-4xl font-pixel text-primary mb-2">
                ZEIND & ALA
              </h1>
              <p className="text-secondary text-sm">COUPLE QUEST</p>
            </motion.div>
            
            <motion.p
              className="absolute bottom-20 text-[10px] text-muted-foreground"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              PRESS ANYWHERE OR WAIT...
            </motion.p>
          </motion.div>
        )}

        {/* Skip Button */}
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-4 right-4 z-[60] text-[10px] text-muted-foreground hover:text-primary transition-colors px-3 py-1 border border-muted-foreground/30 hover:border-primary"
            onClick={handleSkip}
          >
            SKIP →
          </motion.button>
        )}

        {/* Click to skip overlay */}
        <div 
          className="absolute inset-0 z-[55] cursor-pointer" 
          onClick={phase >= 2 ? handleSkip : undefined}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Typewriter Text Component
const TypewriterText = ({ text, delay }: { text: string; delay: number }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return <p>{displayText}<span className="animate-pulse">_</span></p>;
};

// Pixel Particles Component
const PixelParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 md:w-2 md:h-2"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#60a5fa', '#f472b6', '#fbbf24', '#34d399'][i % 4],
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-10vh',
            opacity: [0, 1, 1, 0],
            x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Glitch Logo Component
const GlitchLogo = () => {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -5, 5, -3, 3, 0],
          opacity: [0, 0.8, 0, 0.6, 0, 0],
        }}
        transition={{ duration: 0.3, repeat: 3 }}
      >
        <div className="text-5xl md:text-7xl font-pixel text-red-500/80 select-none">
          ZEIND & ALA
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, 5, -5, 3, -3, 0],
          opacity: [0, 0.8, 0, 0.6, 0, 0],
        }}
        transition={{ duration: 0.3, repeat: 3, delay: 0.05 }}
      >
        <div className="text-5xl md:text-7xl font-pixel text-cyan-500/80 select-none">
          ZEIND & ALA
        </div>
      </motion.div>
      
      {/* Main text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-5xl md:text-7xl font-pixel text-primary relative">
          ZEIND & ALA
          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1, repeat: 2 }}
          />
        </h1>
      </motion.div>
      
      <motion.p
        className="text-center text-secondary mt-4 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        ★ COUPLE QUEST ★
      </motion.p>
    </motion.div>
  );
};

export default IntroAnimation;
