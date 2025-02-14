
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === romaji.toLowerCase()) {
      toast.success("Correct!", {
        style: { background: "#4ade80", color: "white" },
      });
      onCorrect();
      setInput("");
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast.error("Try again!", {
        style: { background: "#f43f5e", color: "white" },
      });
      onIncorrect();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md p-8 rounded-3xl bg-card shadow-xl backdrop-blur-sm border border-white/20"
    >
      <div className="text-center">
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <motion.p
            key={character}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-9xl mb-2 font-japanese font-bold text-foreground animate-float"
          >
            {character}
          </motion.p>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-6 py-4 text-xl rounded-xl border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors bg-white/50 backdrop-blur-sm shadow-inner"
              placeholder="Type romaji here..."
              autoFocus
            />
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/10 pointer-events-none rounded-xl" />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-8 py-4 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
          >
            Check Answer
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
