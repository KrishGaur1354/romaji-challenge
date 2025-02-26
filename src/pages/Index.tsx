import { useState, useEffect } from "react";
import { GameCard } from "@/components/GameCard";
import { ScoreBoard } from "@/components/ScoreBoard";
import DrawingCanvas from "@/components/DrawingCanvas.tsx";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Edit, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { hiraganaData, katakanaData } from "../data/characters";

// Utility function to get a rank message
const getRankMessage = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage === 100) return "Master! Perfect score! 🎉";
  if (percentage >= 80) return "Expert! Almost there! 🌟";
  if (percentage >= 60) return "Intermediate! Keep practicing! 💪";
  if (percentage >= 40) return "Apprentice! You're improving! 📚";
  return "Beginner! Don't give up! 🌱";
};

// Fixed Typewriter Component
const Typewriter = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) return; // Guard against undefined text
    
    let displayTimer: NodeJS.Timeout;
    const characters = text.split('');
    let currentIndex = 0;

    const animateText = () => {
      if (currentIndex < characters.length) {
        setDisplayText(prev => prev + characters[currentIndex]);
        currentIndex++;
        displayTimer = setTimeout(animateText, 100);
      }
    };

    setDisplayText('');
    displayTimer = setTimeout(animateText, 100);

    return () => {
      clearTimeout(displayTimer);
    };
  }, [text]);

  return text ? <span>{displayText}</span> : null;
};

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [challengeMode, setChallengeMode] = useState<"hiragana" | "katakana">("hiragana");
  const [gameMode, setGameMode] = useState<"recognition" | "drawing">("recognition");
  const [headerDisplayIndex, setHeaderDisplayIndex] = useState(0);
  const dataset = challengeMode === "hiragana" ? hiraganaData : katakanaData;
  
  // Fixed header texts with proper Japanese characters
  const getHeaderText = () => {
    if (challengeMode === "hiragana") {
      return headerDisplayIndex === 0 ? "ひらがなチャレンジ" : "Hiragana Challenge";
    }
    return headerDisplayIndex === 0 ? "カタカナチャレンジ" : "Katakana Challenge";
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chances, setChances] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shuffledData, setShuffledData] = useState(
    [...dataset].sort(() => Math.random() - 0.5).slice(0, 15)
  );
  const [showTip, setShowTip] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderDisplayIndex((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const randomSet = [...dataset].sort(() => Math.random() - 0.5).slice(0, 15);
    setShuffledData(randomSet);
    setCurrentIndex(0);
    setScore(0);
    setChances(5);
    setIsGameOver(false);
  }, [challengeMode, dataset]);
  
  const handleGameOver = () => {
    const rankMessage = getRankMessage(score, shuffledData.length);
    toast.info(`Game Over! ${rankMessage}`, {
      duration: 5000,
      style: { background: "#6366f1", color: "white" },
    });
    setIsGameOver(true);
  };
  
  const resetGame = () => {
    setScore(0);
    setChances(5);
    setCurrentIndex(0);
    setIsGameOver(false);
    const randomSet = [...dataset].sort(() => Math.random() - 0.5).slice(0, 15);
    setShuffledData(randomSet);
  };
  
  const handleCorrect = () => {
    setScore((prev) => prev + 1);
    setCurrentIndex((prev) => {
      if (prev + 1 >= shuffledData.length) {
        setTimeout(() => {
          const rankMessage = getRankMessage(score + 1, shuffledData.length);
          toast.success(`Congratulations! ${rankMessage}`, {
            duration: 5000,
            style: { background: "#4ade80", color: "white" },
          });
          resetGame();
        }, 500);
        return prev;
      }
      return prev + 1;
    });
  };
  
  const handleIncorrect = () => {
    setChances((prev) => {
      const newChances = prev - 1;
      if (newChances === 0) {
        handleGameOver();
      }
      return newChances;
    });
  };
  
  // Define header texts for both challenge modes
  const headerTexts =
    challengeMode === "hiragana"
      ? ["ひらがなチャレンジ", "Hiragana Challenge"]
      : ["カタカナチャレンジ", "Katakana Challenge"];
  
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-background to-background/80 p-4 sm:p-6 md:p-8 max-w-lg mx-auto relative">
      <div className="fixed inset-0 bg-japanese-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-2 right-0 mr-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-card hover:bg-accent/10 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-8" style={{ minHeight: "6rem" }}>
          <AnimatePresence mode='wait'>
            <motion.h1
              key={challengeMode + headerDisplayIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-bold font-japanese text-foreground mb-2"
            >
              {getHeaderText()}
            </motion.h1>
          </AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-lg text-muted-foreground"
          >
            Master Japanese characters with elegance
          </motion.p>
        </div>

        <motion.div className="flex justify-center gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChallengeMode("hiragana")}
            className={`px-6 py-2 rounded-full transition-colors ${
              challengeMode === "hiragana"
                ? "bg-accent text-accent-foreground shadow-lg"
                : "bg-card hover:bg-accent/10"
            }`}
          >
            Hiragana
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChallengeMode("katakana")}
            className={`px-6 py-2 rounded-full transition-colors ${
              challengeMode === "katakana"
                ? "bg-accent text-accent-foreground shadow-lg"
                : "bg-card hover:bg-accent/10"
            }`}
          >
            Katakana
          </motion.button>
        </motion.div>

        <motion.div className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameMode("recognition")}
            className={`px-6 py-2 rounded-full transition-colors flex items-center gap-2 ${
              gameMode === "recognition"
                ? "bg-accent text-accent-foreground shadow-lg"
                : "bg-card hover:bg-accent/10"
            }`}
          >
            <Languages className="w-4 h-4" />
            Recognition
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameMode("drawing")}
            className={`px-6 py-2 rounded-full transition-colors flex items-center gap-2 ${
              gameMode === "drawing"
                ? "bg-accent text-accent-foreground shadow-lg"
                : "bg-card hover:bg-accent/10"
            }`}
          >
            <Edit className="w-4 h-4" />
            Drawing
          </motion.button>
        </motion.div>

        <Toaster position="top-center" />
        <ScoreBoard score={score} total={shuffledData.length} chances={chances} />
        {!isGameOver ? (
          <>
            {gameMode === "recognition" ? (
              // Original game mode - recognize characters
              <GameCard
                character={shuffledData[currentIndex].character}
                romaji={shuffledData[currentIndex].romaji}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
              />
            ) : (
              // New drawing mode - draw characters based on romaji
              <div className="text-center mb-4">
                <p className="text-2xl font-bold mb-2">Draw: {shuffledData[currentIndex].romaji}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Draw the {challengeMode} character for "{shuffledData[currentIndex].romaji}"
                </p>
                <DrawingCanvas 
                  expectedCharacter={shuffledData[currentIndex].character}
                  onCorrect={handleCorrect}
                  onIncorrect={handleIncorrect}
                />
              </div>
            )}
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowTip(!showTip)}
              className="mt-4 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Need a hint?
            </motion.button>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-accent italic text-center"
              >
                {gameMode === "recognition" ? (
                  <p>{shuffledData[currentIndex].tip}</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mb-2">{shuffledData[currentIndex].tip}</p>
                    <p className="text-xl font-japanese">
                      {shuffledData[currentIndex].character}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-foreground mb-6">Game Over!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors shadow-lg"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-sm text-muted-foreground animate-fade-in max-w-md text-center"
        >
          {gameMode === "recognition" 
            ? "Type the romaji (roman letters) for the character shown above"
            : "Draw the character that matches the romaji shown above"}
        </motion.p>
      </div>
      <footer className="mt-8 text-center text-xs sm:text-sm text-muted-foreground">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/KrishGaur1354"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          Krish Gaur
        </a>
      </footer>
    </div>
  );
};

export default Index;