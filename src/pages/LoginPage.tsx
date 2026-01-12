import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = () => {
    setIsPressed(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden scanlines">
      {/* Animated stars background */}
      <div className="absolute inset-0 stars-bg" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Gamepad2 className="w-16 h-16 text-primary" />
          </motion.div>
          
          <h1 className="text-xl md:text-2xl text-primary mb-4 tracking-wider">
            COUPLE
          </h1>
          <h2 className="text-2xl md:text-4xl text-foreground mb-2">
            QUEST
          </h2>
          <div className="text-[8px] text-secondary tracking-widest">
            ★ THE ADVENTURE BEGINS ★
          </div>
        </motion.div>

        {/* Decorative pixel hearts */}
        <motion.div
          className="flex gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.3 
              }}
              className="text-heart text-lg"
            >
              ♥
            </motion.div>
          ))}
        </motion.div>

        {/* Press Start Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={handleStart}
          disabled={isPressed}
          className={`
            pixel-btn-primary text-sm tracking-widest
            ${isPressed ? 'animate-pulse' : ''}
          `}
        >
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            PRESS START
          </motion.span>
        </motion.button>

        {/* Version info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-[6px] text-muted-foreground"
        >
          <p>VERSION 1.0.0</p>
          <p className="text-center mt-1">© 2024 COUPLE QUEST</p>
        </motion.div>

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary/30" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary/30" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary/30" />
      </div>
    </div>
  );
};

export default LoginPage;
