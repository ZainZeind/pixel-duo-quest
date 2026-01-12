import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RPGDialogProps {
  children: ReactNode;
  title?: string;
  variant?: "default" | "accent" | "personal" | "party";
  className?: string;
}

const RPGDialog = ({ children, title, variant = "default", className = "" }: RPGDialogProps) => {
  const variantClasses = {
    default: "border-dialog-border",
    accent: "border-primary",
    personal: "border-personal",
    party: "border-party",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        relative bg-dialog-bg border-4 ${variantClasses[variant]} p-4
        ${className}
      `}
      style={{
        boxShadow: `
          inset -4px -4px 0 hsl(var(--pixel-shadow)),
          4px 4px 0 hsl(var(--pixel-shadow))
        `,
      }}
    >
      {title && (
        <div className="absolute -top-3 left-4 px-2 bg-dialog-bg">
          <span className="text-[8px] text-primary uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      {children}
      {/* Corner decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-foreground opacity-50" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-foreground opacity-50" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-foreground opacity-50" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-foreground opacity-50" />
    </motion.div>
  );
};

export default RPGDialog;
