import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShimmeringTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const ShimmeringText: React.FC<ShimmeringTextProps> = ({ 
  children, 
  className = "",
  delay = 0 
}) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1] // Anthropic-style easing
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{
          backgroundSize: "200% 100%",
          filter: "blur(8px)",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2,
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
};

export default ShimmeringText;

