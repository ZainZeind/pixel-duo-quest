import { motion } from "framer-motion";

interface PixelLogoProps {
  size?: "sm" | "md" | "lg";
}

const PixelLogo = ({ size = "md" }: PixelLogoProps) => {
  const scales = {
    sm: 0.5,
    md: 1,
    lg: 1.5,
  };
  
  const scale = scales[size];
  const pixelSize = 4 * scale;

  return (
    <motion.div 
      className="flex items-end justify-center gap-1"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Boy Character */}
      <div className="relative" style={{ width: 32 * scale, height: 40 * scale }}>
        {/* Hair */}
        <div 
          className="absolute bg-amber-800" 
          style={{ 
            width: pixelSize * 6, 
            height: pixelSize * 2, 
            top: 0, 
            left: pixelSize 
          }} 
        />
        {/* Head */}
        <div 
          className="absolute bg-amber-200" 
          style={{ 
            width: pixelSize * 5, 
            height: pixelSize * 3, 
            top: pixelSize * 2, 
            left: pixelSize * 1.5 
          }} 
        />
        {/* Eyes */}
        <div 
          className="absolute bg-slate-800" 
          style={{ width: pixelSize, height: pixelSize, top: pixelSize * 3, left: pixelSize * 2 }} 
        />
        <div 
          className="absolute bg-slate-800" 
          style={{ width: pixelSize, height: pixelSize, top: pixelSize * 3, left: pixelSize * 5 }} 
        />
        {/* Body - Blue */}
        <div 
          className="absolute bg-blue-500" 
          style={{ 
            width: pixelSize * 6, 
            height: pixelSize * 4, 
            top: pixelSize * 5, 
            left: pixelSize 
          }} 
        />
        {/* Legs */}
        <div 
          className="absolute bg-blue-700" 
          style={{ width: pixelSize * 2, height: pixelSize * 2, top: pixelSize * 9, left: pixelSize * 1.5 }} 
        />
        <div 
          className="absolute bg-blue-700" 
          style={{ width: pixelSize * 2, height: pixelSize * 2, top: pixelSize * 9, left: pixelSize * 4.5 }} 
        />
      </div>

      {/* Heart */}
      <motion.div 
        className="text-red-500 mx-1"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ fontSize: 16 * scale }}
      >
        ❤️
      </motion.div>

      {/* Girl Character */}
      <div className="relative" style={{ width: 32 * scale, height: 40 * scale }}>
        {/* Hair with bow */}
        <div 
          className="absolute bg-amber-600" 
          style={{ 
            width: pixelSize * 6, 
            height: pixelSize * 3, 
            top: 0, 
            left: pixelSize 
          }} 
        />
        {/* Bow */}
        <div 
          className="absolute bg-pink-400" 
          style={{ width: pixelSize * 2, height: pixelSize, top: 0, left: pixelSize * 5 }} 
        />
        {/* Head */}
        <div 
          className="absolute bg-amber-200" 
          style={{ 
            width: pixelSize * 5, 
            height: pixelSize * 3, 
            top: pixelSize * 2, 
            left: pixelSize * 1.5 
          }} 
        />
        {/* Eyes */}
        <div 
          className="absolute bg-slate-800" 
          style={{ width: pixelSize, height: pixelSize, top: pixelSize * 3, left: pixelSize * 2 }} 
        />
        <div 
          className="absolute bg-slate-800" 
          style={{ width: pixelSize, height: pixelSize, top: pixelSize * 3, left: pixelSize * 5 }} 
        />
        {/* Body - Pink Dress */}
        <div 
          className="absolute bg-pink-400" 
          style={{ 
            width: pixelSize * 6, 
            height: pixelSize * 3, 
            top: pixelSize * 5, 
            left: pixelSize 
          }} 
        />
        {/* Dress skirt */}
        <div 
          className="absolute bg-pink-300" 
          style={{ 
            width: pixelSize * 7, 
            height: pixelSize * 2, 
            top: pixelSize * 8, 
            left: pixelSize * 0.5 
          }} 
        />
        {/* Legs */}
        <div 
          className="absolute bg-amber-200" 
          style={{ width: pixelSize, height: pixelSize, top: pixelSize * 10, left: pixelSize * 2 }} 
        />
        <div 
          className="absolute bg-amber-200" 
          style={{ width: pixelSize, height: pixelSize, top: pixelSize * 10, left: pixelSize * 5 }} 
        />
      </div>
    </motion.div>
  );
};

export default PixelLogo;
