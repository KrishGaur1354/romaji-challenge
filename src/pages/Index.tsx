import { useState, useEffect } from "react";
import { GameCard } from "@/components/GameCard";
import { ScoreBoard } from "@/components/ScoreBoard";
import DrawingCanvas from "@/components/DrawingCanvas.tsx";
import { Handbook } from "@/components/Handbook"; // Import the Handbook component
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Edit, Languages, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { hiraganaData, katakanaData } from "../data/characters";

// Utility function to get a rank message
const getRankMessage = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage === 100) return "Perfect Master! Exceptional work!";
  if (percentage >= 90) return "Expert Level! Outstanding performance!";
  if (percentage >= 75) return "Advanced! Excellent progress!";
  if (percentage >= 60) return "Intermediate! Keep up the great work!";
  if (percentage >= 40) return "Developing! You're improving steadily!";
  return "Beginner! Every step counts!";
};

// Translation Challenge Component
const TranslationChallenge = ({ 
  currentWord, 
  onCorrect, 
  onIncorrect 
}: { 
  currentWord: { character: string; romaji: string; tip: string };
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const correctAnswer = currentWord.tip.toLowerCase();
    
    // Extract the meaning from tip (assuming format "Means 'word'")
    const meaningMatch = correctAnswer.match(/means ['"]([^'"]+)['"]/);
    const expectedMeaning = meaningMatch ? meaningMatch[1] : "";
    
    if (normalizedAnswer === expectedMeaning || normalizedAnswer === currentWord.romaji) {
      onCorrect();
      setUserAnswer("");
      setShowHint(false);
    } else {
      onIncorrect();
      setShowHint(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4 sm:space-y-6 bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-accent/20 shadow-xl w-full"
    >
      <div className="space-y-3 sm:space-y-4">
        <motion.div 
          className="text-4xl sm:text-5xl md:text-6xl font-japanese leading-none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          {currentWord.character}
        </motion.div>
        <p className="text-base sm:text-lg text-muted-foreground px-2">
          What does this word mean in English?
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter the meaning..."
          className="w-full px-4 sm:px-6 py-3 text-base sm:text-lg text-center rounded-xl sm:rounded-2xl border-2 border-accent/30 focus:border-accent focus:outline-none bg-background/80 backdrop-blur-sm transition-all duration-300"
          autoFocus
        />
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={checkAnswer}
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Submit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHint(!showHint)}
            className="px-4 sm:px-6 py-3 bg-card hover:bg-accent/10 rounded-xl sm:rounded-2xl transition-all duration-300"
          >
            Hint
          </motion.button>
        </div>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent italic bg-accent/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-base"
        >
          Romaji: {currentWord.romaji}
        </motion.div>
      )}
    </motion.div>
  );
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
  const [gameMode, setGameMode] = useState<"recognition" | "drawing" | "translation">("recognition");
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
    // Filter dataset for translation mode to include only words (longer than 1 character)
    const filteredData = gameMode === "translation" 
      ? dataset.filter(item => item.character.length > 1 && item.tip.includes("Means"))
      : dataset;
    
    const randomSet = [...filteredData].sort(() => Math.random() - 0.5).slice(0, 15);
    setShuffledData(randomSet);
    setCurrentIndex(0);
    setScore(0);
    setChances(5);
    setIsGameOver(false);
  }, [challengeMode, gameMode, dataset]);
  
  const handleGameOver = () => {
    const rankMessage = getRankMessage(score, shuffledData.length);
    toast.info(`Game Complete! ${rankMessage}`, {
      duration: 5000,
      style: { 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        color: "white",
        border: "none",
        borderRadius: "16px"
      },
    });
    setIsGameOver(true);
  };
  
  const resetGame = () => {
    setScore(0);
    setChances(5);
    setCurrentIndex(0);
    setIsGameOver(false);
    const filteredData = gameMode === "translation" 
      ? dataset.filter(item => item.character.length > 1 && item.tip.includes("Means"))
      : dataset;
    const randomSet = [...filteredData].sort(() => Math.random() - 0.5).slice(0, 15);
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
            style: { 
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
              color: "white",
              border: "none",
              borderRadius: "16px"
            },
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
  
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-background via-background/95 to-accent/5 p-3 sm:p-4 md:p-6 lg:p-8 max-w-md sm:max-w-lg mx-auto relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 sm:p-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-accent/20 transition-all duration-300 shadow-lg border border-accent/20"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </motion.button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center relative z-10 space-y-4 sm:space-y-6">
        <div className="text-center space-y-3 sm:space-y-4" style={{ minHeight: "auto" }}>
          <AnimatePresence mode='wait'>
            <motion.h1
              key={challengeMode + headerDisplayIndex}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-japanese text-foreground bg-gradient-to-r from-foreground to-accent/80 bg-clip-text text-transparent leading-tight px-2"
            >
              {getHeaderText()}
            </motion.h1>
          </AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-light px-4"
          >
            Master Japanese characters with elegance
          </motion.p>
        </div>

        {/* Character type selection */}
        <motion.div 
          className="flex justify-center gap-2 sm:gap-3 w-full px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChallengeMode("hiragana")}
            className={`flex-1 max-w-32 sm:max-w-none sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 text-sm sm:text-base ${
              challengeMode === "hiragana"
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25"
                : "bg-card/50 backdrop-blur-sm hover:bg-accent/10 border border-accent/20"
            }`}
          >
            Hiragana
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChallengeMode("katakana")}
            className={`flex-1 max-w-32 sm:max-w-none sm:flex-none px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 text-sm sm:text-base ${
              challengeMode === "katakana"
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25"
                : "bg-card/50 backdrop-blur-sm hover:bg-accent/10 border border-accent/20"
            }`}
          >
            Katakana
          </motion.button>
        </motion.div>

        {/* Game mode selection */}
        <motion.div 
          className="flex justify-center gap-1 sm:gap-3 w-full px-2 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameMode("recognition")}
            className={`flex-1 px-2 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base ${
              gameMode === "recognition"
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25"
                : "bg-card/50 backdrop-blur-sm hover:bg-accent/10 border border-accent/20"
            }`}
          >
            <Languages className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Recognition</span>
            <span className="sm:hidden">Read</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameMode("drawing")}
            className={`flex-1 px-2 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base ${
              gameMode === "drawing"
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25"
                : "bg-card/50 backdrop-blur-sm hover:bg-accent/10 border border-accent/20"
            }`}
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Drawing</span>
            <span className="sm:hidden">Draw</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameMode("translation")}
            className={`flex-1 px-2 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base ${
              gameMode === "translation"
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/25"
                : "bg-card/50 backdrop-blur-sm hover:bg-accent/10 border border-accent/20"
            }`}
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Translation</span>
            <span className="sm:hidden">Translate</span>
          </motion.button>
        </motion.div>

        <Toaster position="top-center" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full"
        >
          <ScoreBoard score={score} total={shuffledData.length} chances={chances} />
        </motion.div>
        
        {!isGameOver ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full"
          >
            {gameMode === "recognition" ? (
              // Original game mode - recognize characters
              <GameCard
                character={shuffledData[currentIndex]?.character}
                romaji={shuffledData[currentIndex]?.romaji}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
              />
            ) : gameMode === "drawing" ? (
              // Drawing mode - draw characters based on romaji
              <div className="text-center space-y-4 sm:space-y-6 bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-accent/20 shadow-xl">
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xl sm:text-2xl font-bold">Draw: {shuffledData[currentIndex]?.romaji}</p>
                  <p className="text-sm sm:text-base text-muted-foreground px-2">
                    Draw the {challengeMode} character for "{shuffledData[currentIndex]?.romaji}"
                  </p>
                </div>
                <DrawingCanvas 
                  expectedCharacter={shuffledData[currentIndex]?.character}
                  onCorrect={handleCorrect}
                  onIncorrect={handleIncorrect}
                  size={Math.min(280, window.innerWidth - 80)} // Responsive canvas size
                />
              </div>
            ) : (
              // Translation mode - translate words
              <TranslationChallenge
                currentWord={shuffledData[currentIndex]}
                onCorrect={handleCorrect}
                onIncorrect={handleIncorrect}
              />
            )}
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setShowTip(!showTip)}
              className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground hover:text-accent transition-colors text-center w-full"
            >
              Need a hint?
            </motion.button>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 sm:mt-4 p-3 sm:p-4 bg-accent/10 rounded-xl sm:rounded-2xl text-center"
              >
                {gameMode === "recognition" ? (
                  <p className="text-accent text-sm sm:text-base">{shuffledData[currentIndex]?.tip}</p>
                ) : gameMode === "drawing" ? (
                  <div className="space-y-2">
                    <p className="text-accent text-xs sm:text-sm">{shuffledData[currentIndex]?.tip}</p>
                    <p className="text-2xl sm:text-3xl font-japanese">
                      {shuffledData[currentIndex]?.character}
                    </p>
                  </div>
                ) : (
                  <p className="text-accent text-sm sm:text-base">Romaji: {shuffledData[currentIndex]?.romaji}</p>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-accent/20 shadow-xl w-full"
          >
            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">Game Complete!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-xl sm:rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs sm:text-sm text-muted-foreground text-center max-w-sm leading-relaxed px-4"
        >
          {gameMode === "recognition" 
            ? "Type the romaji (roman letters) for the character shown above"
            : gameMode === "drawing"
            ? "Draw the character that matches the romaji shown above"
            : "Translate the Japanese word to English"}
        </motion.p>
      </div>
      
      <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Crafted with dedication by{" "}
          <a
            href="https://github.com/KrishGaur1354"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors font-medium"
          >
            Krish Gaur
          </a>
        </motion.div>
      </footer>
      
      {/* Add the Handbook component */}
      <Handbook />
    </div>
  );
};

export default Index;