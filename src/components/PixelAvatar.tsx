import { motion } from "framer-motion";

interface PixelAvatarProps {
  type: "player1" | "player2";
  size?: "sm" | "md" | "lg";
  isIdle?: boolean;
}

const PixelAvatar = ({ type, size = "md", isIdle = true }: PixelAvatarProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  // Simple pixel art using CSS grid
  const player1Pixels = [
    "0000110000",
    "0001111000",
    "0011111100",
    "0010110100",
    "0011111100",
    "0001111000",
    "0000110000",
    "0011111100",
    "0111111110",
    "0101111010",
    "0001111000",
    "0001001000",
    "0011001100",
  ];

  const player2Pixels = [
    "0000110000",
    "0001111000",
    "0111111110",
    "0110110110",
    "0111111110",
    "0011111100",
    "0000110000",
    "0011111100",
    "0111111110",
    "0101111010",
    "0001111000",
    "0001001000",
    "0011001100",
  ];

  const pixels = type === "player1" ? player1Pixels : player2Pixels;
  const hairColor = type === "player1" ? "bg-amber-800" : "bg-amber-950";
  const shirtColor = type === "player1" ? "bg-blue-500" : "bg-pink-500";

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={isIdle ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-full grid grid-rows-[13] gap-0">
        {pixels.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.split("").map((pixel, colIndex) => {
              let colorClass = "bg-transparent";
              if (pixel === "1") {
                if (rowIndex < 6) colorClass = hairColor;
                else if (rowIndex < 7) colorClass = "bg-amber-200"; // skin
                else colorClass = shirtColor;
              }
              return (
                <div
                  key={colIndex}
                  className={`aspect-square ${colorClass}`}
                  style={{ width: "10%", height: "7.7%" }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PixelAvatar;
