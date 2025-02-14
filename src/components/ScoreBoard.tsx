
import { motion } from "framer-motion";

interface ScoreBoardProps {
  score: number;
  total: number;
  chances: number;
}

export const ScoreBoard = ({ score, total, chances }: ScoreBoardProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="text-center mb-12 w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-medium text-foreground">
          Score: <span className="text-accent font-semibold">{score}</span> / {total}
        </p>
        <p className="text-xl font-medium text-foreground">
          Chances: <span className="text-accent font-semibold">{chances}</span>
        </p>
      </div>
      <div className="w-full h-3 bg-white/50 rounded-full mt-2 overflow-hidden backdrop-blur-sm shadow-inner">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${(score / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 100 }}
          className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full shadow-lg"
        />
      </div>
    </motion.div>
  );
};
