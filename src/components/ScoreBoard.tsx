import { motion } from "framer-motion";

interface ScoreBoardProps {
  score: number;
  total: number;
  chances: number;
}

export const ScoreBoard = ({ score, total, chances }: ScoreBoardProps) => {
  const progressPercentage = (score / total) * 100;
  const chancesColor = chances <= 2 ? 'text-red-500' : chances <= 3 ? 'text-yellow-500' : 'text-green-500';
  
  return (
    <motion.div
      initial={{ y: -30, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center mb-6 sm:mb-8 w-full"
    >
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-accent/20 shadow-xl space-y-2 sm:space-y-3">
        {/* Score and chances display */}
        <div className="flex justify-between items-center">
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Score</p>
            <p className="text-lg sm:text-2xl font-bold">
              <span className="text-accent">{score}</span>
              <span className="text-muted-foreground text-sm sm:text-lg">/{total}</span>
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Chances</p>
            <p className={`text-lg sm:text-2xl font-bold ${chancesColor}`}>
              {chances}
            </p>
          </motion.div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="relative w-full h-2 sm:h-3 bg-accent/10 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                duration: 0.8 
              }}
              className="h-full bg-gradient-to-r from-accent via-accent to-accent/80 rounded-full shadow-sm relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse" />
            </motion.div>
            
            {/* Progress indicator dot */}
            {progressPercentage > 0 && (
              <motion.div
                initial={{ scale: 0, x: -6 }}
                animate={{ 
                  scale: 1, 
                  x: `${progressPercentage * 0.8}%` 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200,
                  delay: 0.3 
                }}
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg border-2 border-accent"
              />
            )}
          </div>
        </div>
        
        {/* Achievement badges - smaller on mobile */}
        <div className="flex justify-center space-x-1 sm:space-x-2 mt-3 sm:mt-4">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: score > index * 3 ? 1 : 0.6, 
                opacity: score > index * 3 ? 1 : 0.3 
              }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300 
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                score > index * 3 
                  ? 'bg-accent shadow-lg' 
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
