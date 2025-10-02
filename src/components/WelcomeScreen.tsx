import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Trophy, Edit, Languages, BookOpen, Sparkles, X, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const pages = [
    {
      title: "Welcome to Romaji Challenge",
      titleJP: "ローマ字チャレンジへようこそ",
      content: "Master Japanese Hiragana and Katakana through interactive games and AI-powered learning.",
      icon: <Sparkles className="w-16 h-16 text-accent" />,
    },
    {
      title: "Three Game Modes",
      titleJP: "３つのゲームモード",
      content: "Choose your learning style with Recognition, Drawing, or Translation challenges.",
      icon: <Languages className="w-16 h-16 text-accent" />,
    },
    {
      title: "AI-Powered Drawing",
      titleJP: "AI描画認識",
      content: "Draw characters and get instant feedback from our TensorFlow.js neural network.",
      icon: <Edit className="w-16 h-16 text-accent" />,
    },
    {
      title: "Daily Leaderboard",
      titleJP: "デイリーランキング",
      content: "Compete for the top spot! Perfect scores record your time. Leaderboard resets daily at midnight.",
      icon: <Trophy className="w-16 h-16 text-accent" />,
    },
    {
      title: "Study Handbook",
      titleJP: "学習ハンドブック",
      content: "Access a comprehensive reference guide for all Hiragana and Katakana characters anytime.",
      icon: <Book className="w-16 h-16 text-accent" />,
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 overflow-hidden"
      >
        {/* Animated sakura petals in background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{ 
                x: `${Math.random() * 100}%`, 
                y: -50,
                rotate: 0,
              }}
              animate={{
                y: "110vh",
                rotate: 360,
                x: `${Math.random() * 100}%`,
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              🌸
            </motion.div>
          ))}
        </div>

        {/* Main content container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isExiting ? 1.2 : 1, 
            opacity: isExiting ? 0 : 1 
          }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: isExiting ? 0.8 : 0.6,
          }}
          className="relative w-full max-w-2xl mx-4 bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-accent/20 overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-accent via-pink-500 to-accent p-8 overflow-hidden">
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
            <div className="relative text-center">
              <motion.div
                key={currentPage}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center mb-4">
                  {pages[currentPage].icon}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-japanese">
                  {pages[currentPage].titleJP}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-white/90">
                  {pages[currentPage].title}
                </h2>
              </motion.div>
            </div>
          </div>

          {/* Content area */}
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-8"
              >
                <p className="text-lg sm:text-xl text-foreground leading-relaxed">
                  {pages[currentPage].content}
                </p>

                {/* Feature details based on page */}
                {currentPage === 1 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Languages className="w-5 h-5 text-accent" />
                      <span className="text-sm">Recognition: Type the romaji</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Edit className="w-5 h-5 text-accent" />
                      <span className="text-sm">Drawing: Draw the character</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <BookOpen className="w-5 h-5 text-accent" />
                      <span className="text-sm">Translation: Translate to English</span>
                    </div>
                  </div>
                )}

                {currentPage === 3 && (
                  <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <p>⏱️ Timer starts on your first correct answer</p>
                    <p>🏆 Get 15/15 to submit your time to the leaderboard</p>
                    <p>📅 Rankings reset daily for fresh competition</p>
                  </div>
                )}

                {currentPage === 4 && (
                  <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <p>📖 Access the handbook anytime via the book icon</p>
                    <p>🌸 Beautiful Japanese-themed interface</p>
                    <p>📱 Fully optimized for mobile devices</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {pages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? "w-8 bg-accent"
                      : index < currentPage
                      ? "w-2 bg-accent/50"
                      : "w-2 bg-muted"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentPage(index)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentPage > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex-1 px-6 py-3 rounded-xl bg-card hover:bg-accent/10 border-2 border-accent/20 transition-colors"
                >
                  Back
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className={`${
                  currentPage === 0 ? "w-full" : "flex-1"
                } px-6 py-4 rounded-xl bg-gradient-to-r from-accent via-pink-500 to-accent text-accent-foreground font-semibold shadow-lg border-2 border-white/20 flex items-center justify-center gap-2`}
              >
                {currentPage === pages.length - 1 ? (
                  <>
                    <span>I Understand - Let's Go!</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Skip option */}
            {currentPage < pages.length - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleComplete}
                className="w-full mt-4 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Skip tutorial
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;

