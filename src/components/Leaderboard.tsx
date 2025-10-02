import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, X, Calendar, Sparkles } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  score: number;
  timestamp: number;
  mode: string;
  timeTaken?: number; // Time in seconds
}

interface LeaderboardProps {
  currentScore?: number;
  currentMode?: string;
  onClose?: () => void;
  timeTaken?: number; // Time in seconds
  isPerfectScore?: boolean;
}

const STORAGE_KEY = "romaji_leaderboard";
const DATE_KEY = "romaji_leaderboard_date";

const getToday = () => {
  return new Date().toDateString();
};

const resetLeaderboardIfNewDay = () => {
  const today = getToday();
  const lastDate = localStorage.getItem(DATE_KEY);
  
  if (lastDate !== today) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(DATE_KEY, today);
    return true;
  }
  return false;
};

const getLeaderboard = (): LeaderboardEntry[] => {
  resetLeaderboardIfNewDay();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveToLeaderboard = (entry: LeaderboardEntry) => {
  resetLeaderboardIfNewDay();
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  const top20 = leaderboard.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top20));
};

export const Leaderboard = ({ currentScore, currentMode, onClose, timeTaken, isPerfectScore }: LeaderboardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [username, setUsername] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
    // Auto-open if perfect score achieved
    if (isPerfectScore && currentScore !== undefined) {
      setIsOpen(true);
      setShowSubmitForm(true);
    }
  }, [isPerfectScore, currentScore]);

  const handleOpen = () => {
    setIsOpen(true);
    setLeaderboard(getLeaderboard());
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSubmitForm(false);
    setUsername("");
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && currentScore !== undefined && currentMode) {
      const entry: LeaderboardEntry = {
        username: username.trim(),
        score: currentScore,
        timestamp: Date.now(),
        mode: currentMode,
        timeTaken: timeTaken,
      };
      saveToLeaderboard(entry);
      setLeaderboard(getLeaderboard());
      setHasSubmitted(true);
      setShowSubmitForm(false);
      setUsername("");
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-amber-700/30";
      default:
        return "bg-card/50 border-accent/10";
    }
  };

  return (
    <>
      {/* Floating Leaderboard Button - positioned near handbook */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-20 sm:bottom-4 right-3 sm:right-20 z-40 p-3 rounded-full bg-gradient-to-br from-accent via-pink-500 to-accent text-accent-foreground shadow-lg border-2 border-white/20 backdrop-blur-sm"
      >
        <Trophy className="w-5 h-5" />
      </motion.button>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-background/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-accent/20 overflow-hidden"
            >
              {/* Header with Japanese wave pattern */}
              <div className="relative bg-gradient-to-r from-accent via-accent/90 to-accent/80 p-6 overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25, 50 50 T 100 50' stroke='white' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Trophy className="w-8 h-8 text-accent-foreground" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-accent-foreground font-japanese">
                        リーダーボード
                      </h2>
                      <p className="text-sm text-accent-foreground/80">Daily Leaderboard</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-accent-foreground" />
                  </motion.button>
                </div>
                
                {/* Daily Reset Notice */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 flex items-center space-x-2 text-accent-foreground/90 text-sm bg-white/10 rounded-xl p-2 backdrop-blur-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Resets daily at midnight • Today's rankings</span>
                </motion.div>
              </div>

              {/* Leaderboard List */}
              <div className="max-h-96 overflow-y-auto p-6 space-y-3">
                {leaderboard.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No entries yet today</p>
                    <p className="text-sm mt-2">Be the first to join the leaderboard!</p>
                  </motion.div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <motion.div
                      key={`${entry.username}-${entry.timestamp}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm ${getRankColor(index + 1)}`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {getRankIcon(index + 1)}
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{entry.username}</p>
                          <p className="text-xs text-muted-foreground">{entry.mode}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="text-lg font-bold text-accent"
                        >
                          {entry.score} pts
                        </motion.div>
                        {entry.timeTaken && (
                          <div className="text-xs text-muted-foreground">
                            ⏱️ {formatTime(entry.timeTaken)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Submit Score Section */}
              {currentScore !== undefined && !hasSubmitted && (
                <div className="border-t border-accent/20 p-6 bg-accent/5">
                  {isPerfectScore && timeTaken && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-4 p-4 bg-gradient-to-r from-accent/20 via-pink-500/20 to-accent/20 rounded-xl text-center border-2 border-accent/30"
                    >
                      <p className="text-2xl font-bold text-accent mb-2">🎉 Perfect Score! 🎉</p>
                      <p className="text-lg">Time: {formatTime(timeTaken)}</p>
                      <p className="text-sm text-muted-foreground mt-1">Enter your name to claim your spot!</p>
                    </motion.div>
                  )}
                  {!showSubmitForm ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSubmitForm(true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-accent via-pink-500 to-accent text-accent-foreground rounded-xl font-medium shadow-lg border-2 border-white/20"
                    >
                      Submit Your Score ({currentScore} pts{timeTaken ? ` • ${formatTime(timeTaken)}` : ''})
                    </motion.button>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        maxLength={20}
                        className="w-full px-4 py-3 rounded-xl border-2 border-accent/30 focus:border-accent focus:outline-none bg-background/80 backdrop-blur-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={!username.trim()}
                          className={`flex-1 px-6 py-3 rounded-xl font-medium shadow-lg border-2 ${
                            username.trim()
                              ? "bg-gradient-to-r from-accent via-pink-500 to-accent text-accent-foreground border-white/20"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                          }`}
                        >
                          Submit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setShowSubmitForm(false)}
                          className="px-6 py-3 rounded-xl bg-card hover:bg-accent/10 transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {hasSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-accent/20 p-6 bg-green-500/10"
                >
                  <p className="text-center text-green-600 dark:text-green-400 font-medium">
                    ✨ Score submitted successfully!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Leaderboard;


