import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface GameCardProps {
  character: string;
  romaji: string;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export const GameCard = ({ character, romaji, onCorrect, onIncorrect }: GameCardProps) => {
  const [input, setInput] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === romaji.toLowerCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        onCorrect();
        setInput("");
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setIsCorrect(null);
      }, 800);
      toast.error("Not quite right, try again!", {
        style: { 
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)", 
          color: "white",
          border: "none",
          borderRadius: "16px"
        },
      });
      onIncorrect();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-full bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-accent/20 shadow-xl overflow-hidden relative"
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative p-4 sm:p-8 text-center space-y-6 sm:space-y-8">
        <motion.div
          animate={isShaking ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {/* Character display with enhanced styling */}
          <motion.div
            key={character}
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative"
          >
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-japanese font-bold text-foreground mb-4 relative leading-none">
              {character}
              {/* Success/error indicator */}
              {isCorrect !== null && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  <span className="text-white text-sm sm:text-lg">
                    {isCorrect ? '✓' : '✗'}
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent opacity-30 blur-2xl pointer-events-none" />
          </motion.div>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <motion.input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-xl text-center rounded-xl sm:rounded-2xl border-2 border-accent/30 focus:border-accent focus:outline-none transition-all duration-300 bg-background/80 backdrop-blur-sm shadow-inner placeholder-muted-foreground"
              placeholder="Type romaji here..."
              autoFocus
              whileFocus={{ scale: 1.02 }}
              animate={isCorrect === false ? { borderColor: "#ef4444" } : {}}
            />
            
            {/* Input field enhancement */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent pointer-events-none rounded-xl sm:rounded-2xl" />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            disabled={!input.trim() || isCorrect === true}
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative text-sm sm:text-base">
              {isCorrect === true ? 'Correct!' : 'Check Answer'}
            </span>
          </motion.button>
        </form>
        
        {/* Helpful hint */}
        <motion.p 
          className="text-xs sm:text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Enter the romanized pronunciation
        </motion.p>
      </div>
    </motion.div>
  );
};
