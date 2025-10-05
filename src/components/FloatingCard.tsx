import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className = "",
  delay = 0,
  index = 0
}) => {
  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: delay + index * 0.1,
        ease: [0.16, 1, 0.3, 1] // Anthropic-style cubic-bezier
      }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <motion.div
        className="relative h-full"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FloatingCard;

