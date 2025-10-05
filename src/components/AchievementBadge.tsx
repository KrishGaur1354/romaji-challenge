import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Target, Award, Sparkles } from "lucide-react";

interface AchievementBadgeProps {
  type: "perfect" | "speed" | "streak" | "milestone" | "master" | "firstWin";
  visible: boolean;
  onClose: () => void;
}

const achievementData = {
  perfect: {
    icon: Trophy,
    title: "Perfect Score!",
    description: "Flawless performance",
    color: "from-yellow-400 to-orange-500",
    emoji: "🏆",
  },
  speed: {
    icon: Zap,
    title: "Speed Master!",
    description: "Lightning fast completion",
    color: "from-blue-400 to-cyan-500",
    emoji: "⚡",
  },
  streak: {
    icon: Target,
    title: "Hot Streak!",
    description: "Multiple correct answers in a row",
    color: "from-red-400 to-pink-500",
    emoji: "🔥",
  },
  milestone: {
    icon: Star,
    title: "Milestone Reached!",
    description: "You're making great progress",
    color: "from-purple-400 to-pink-500",
    emoji: "⭐",
  },
  master: {
    icon: Award,
    title: "Character Master!",
    description: "Mastered all characters",
    color: "from-green-400 to-emerald-500",
    emoji: "🎖️",
  },
  firstWin: {
    icon: Sparkles,
    title: "First Victory!",
    description: "Your journey begins",
    color: "from-indigo-400 to-purple-500",
    emoji: "✨",
  },
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ type, visible, onClose }) => {
  const achievement = achievementData[type];
  const Icon = achievement.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Badge Card */}
          <motion.div
            className="relative bg-card border-2 border-accent/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              duration: 0.7,
              bounce: 0.4,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${achievement.color} opacity-10`}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10 text-center space-y-6">
              {/* Icon with animation */}
              <motion.div
                className="relative mx-auto w-24 h-24"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${achievement.color} blur-xl opacity-60`} />
                <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center text-4xl`}>
                  <span className="drop-shadow-lg">{achievement.emoji}</span>
                </div>
              </motion.div>

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                    top: `${40 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                >
                  ✨
                </motion.div>
              ))}

              {/* Text content */}
              <div className="space-y-2">
                <motion.h2
                  className={`text-3xl font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {achievement.title}
                </motion.h2>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {achievement.description}
                </motion.p>
              </div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className={`px-8 py-3 rounded-full bg-gradient-to-r ${achievement.color} text-white font-medium shadow-lg hover:shadow-xl transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementBadge;

