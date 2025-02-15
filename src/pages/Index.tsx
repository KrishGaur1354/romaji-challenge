import { useState, useEffect } from "react";
import { GameCard } from "@/components/GameCard";
import { ScoreBoard } from "@/components/ScoreBoard";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// Complete hiragana data (79 items)
export const hiraganaData = [
  // Basic Hiragana (43 items)
  { character: "あ", romaji: "a", tip: "Like the 'a' in 'father'" },
  { character: "い", romaji: "i", tip: "Sounds like 'ee' in 'feet'" },
  { character: "う", romaji: "u", tip: "Pronounced like 'oo' in 'boot'" },
  { character: "え", romaji: "e", tip: "Similar to 'e' in 'pet'" },
  { character: "お", romaji: "o", tip: "Like the 'o' in 'go'" },
  { character: "か", romaji: "ka", tip: "Starts with a 'k' sound" },
  { character: "き", romaji: "ki", tip: "Sounds like 'key'" },
  { character: "く", romaji: "ku", tip: "Pronounced like 'coo'" },
  { character: "け", romaji: "ke", tip: "Similar to 'kay'" },
  { character: "こ", romaji: "ko", tip: "Like 'ko' in 'koala'" },
  { character: "さ", romaji: "sa", tip: "Starts with an 's' sound" },
  { character: "し", romaji: "shi", tip: "Pronounced 'she'" },
  { character: "す", romaji: "su", tip: "Sounds like 'sue'" },
  { character: "せ", romaji: "se", tip: "Like 'say'" },
  { character: "そ", romaji: "so", tip: "Simply 'so'" },
  { character: "た", romaji: "ta", tip: "Starts with a 't' sound" },
  { character: "ち", romaji: "chi", tip: "Sounds like 'chee'" },
  { character: "つ", romaji: "tsu", tip: "Pronounced as in 'tsunami'" },
  { character: "て", romaji: "te", tip: "Like 'te' in 'ten'" },
  { character: "と", romaji: "to", tip: "Pronounced 'toh'" },
  { character: "な", romaji: "na", tip: "Starts with an 'n' sound" },
  { character: "に", romaji: "ni", tip: "Sounds like 'knee'" },
  { character: "ぬ", romaji: "nu", tip: "Pronounced like 'new'" },
  { character: "ね", romaji: "ne", tip: "Simply 'neh'" },
  { character: "の", romaji: "no", tip: "Like 'no' in English" },
  { character: "は", romaji: "ha", tip: "Starts with an 'h' sound" },
  { character: "ひ", romaji: "hi", tip: "Sounds like 'he'" },
  { character: "ふ", romaji: "fu", tip: "Pronounced 'foo'" },
  { character: "へ", romaji: "he", tip: "Like 'heh'" },
  { character: "ほ", romaji: "ho", tip: "Sounds like 'ho' in 'hope'" },
  { character: "ま", romaji: "ma", tip: "Starts with an 'm' sound" },
  { character: "み", romaji: "mi", tip: "Sounds like 'me'" },
  { character: "む", romaji: "mu", tip: "Pronounced like 'moo'" },
  { character: "め", romaji: "me", tip: "Simply 'meh'" },
  { character: "も", romaji: "mo", tip: "Like 'mo' in 'more'" },
  { character: "や", romaji: "ya", tip: "Unique 'ya' sound" },
  { character: "ゆ", romaji: "yu", tip: "Sounds like 'you'" },
  { character: "よ", romaji: "yo", tip: "Like 'yo' in 'yoga'" },
  { character: "ら", romaji: "ra", tip: "Starts with an 'r' sound" },
  { character: "り", romaji: "ri", tip: "Sounds like 'ree'" },
  { character: "る", romaji: "ru", tip: "Pronounced like 'roo'" },
  { character: "れ", romaji: "re", tip: "Simply 'reh'" },
  { character: "ろ", romaji: "ro", tip: "Pronounced like 'row'" },
  { character: "わ", romaji: "wa", tip: "Unique 'wa' sound" },
  { character: "を", romaji: "wo", tip: "Used as a particle, pronounced 'o'" },
  { character: "ん", romaji: "n", tip: "The nasal sound" },

  // Combination Sounds (Yōon) (21 items)
  { character: "きゃ", romaji: "kya", tip: "Combine 'ki' + small 'ya'" },
  { character: "きゅ", romaji: "kyu", tip: "Combine 'ki' + small 'yu'" },
  { character: "きょ", romaji: "kyo", tip: "Combine 'ki' + small 'yo'" },
  { character: "しゃ", romaji: "sha", tip: "Combine 'shi' + small 'ya'" },
  { character: "しゅ", romaji: "shu", tip: "Combine 'shi' + small 'yu'" },
  { character: "しょ", romaji: "sho", tip: "Combine 'shi' + small 'yo'" },
  { character: "ちゃ", romaji: "cha", tip: "Combine 'chi' + small 'ya'" },
  { character: "ちゅ", romaji: "chu", tip: "Combine 'chi' + small 'yu'" },
  { character: "ちょ", romaji: "cho", tip: "Combine 'chi' + small 'yo'" },
  { character: "にゃ", romaji: "nya", tip: "Combine 'ni' + small 'ya'" },
  { character: "にゅ", romaji: "nyu", tip: "Combine 'ni' + small 'yu'" },
  { character: "にょ", romaji: "nyo", tip: "Combine 'ni' + small 'yo'" },
  { character: "ひゃ", romaji: "hya", tip: "Combine 'hi' + small 'ya'" },
  { character: "ひゅ", romaji: "hyu", tip: "Combine 'hi' + small 'yu'" },
  { character: "ひょ", romaji: "hyo", tip: "Combine 'hi' + small 'yo'" },
  { character: "みゃ", romaji: "mya", tip: "Combine 'mi' + small 'ya'" },
  { character: "みゅ", romaji: "myu", tip: "Combine 'mi' + small 'yu'" },
  { character: "みょ", romaji: "myo", tip: "Combine 'mi' + small 'yo'" },
  { character: "りゃ", romaji: "rya", tip: "Combine 'ri' + small 'ya'" },
  { character: "りゅ", romaji: "ryu", tip: "Combine 'ri' + small 'yu'" },
  { character: "りょ", romaji: "ryo", tip: "Combine 'ri' + small 'yo'" },

  // Easy Words (12 items)
  { character: "ねこ", romaji: "neko", tip: "Means 'cat'" },
  { character: "いぬ", romaji: "inu", tip: "Means 'dog'" },
  { character: "あめ", romaji: "ame", tip: "Means 'rain'" },
  { character: "たまご", romaji: "tamago", tip: "Means 'egg'" },
  { character: "みず", romaji: "mizu", tip: "Means 'water'" },
  { character: "はな", romaji: "hana", tip: "Means 'flower'" },
  { character: "やま", romaji: "yama", tip: "Means 'mountain'" },
  { character: "くるま", romaji: "kuruma", tip: "Means 'car'" },
  { character: "でんしゃ", romaji: "densha", tip: "Means 'train'" },
  { character: "さかな", romaji: "sakana", tip: "Means 'fish'" },
  { character: "おちゃ", romaji: "ocha", tip: "Means 'tea'" },
  { character: "ごはん", romaji: "gohan", tip: "Means 'rice' or 'meal'" },
];

// Katakana data (expanded)
export const katakanaData = [
  // Basic Katakana (43 items)
  { character: "ア", romaji: "a", tip: "Like the 'a' in 'father'" },
  { character: "イ", romaji: "i", tip: "Sounds like 'ee' in 'feet'" },
  { character: "ウ", romaji: "u", tip: "Pronounced like 'oo' in 'boot'" },
  { character: "エ", romaji: "e", tip: "Similar to 'e' in 'pet'" },
  { character: "オ", romaji: "o", tip: "Like the 'o' in 'go'" },
  { character: "カ", romaji: "ka", tip: "Starts with a 'k' sound" },
  { character: "キ", romaji: "ki", tip: "Sounds like 'key'" },
  { character: "ク", romaji: "ku", tip: "Pronounced like 'coo'" },
  { character: "ケ", romaji: "ke", tip: "Similar to 'kay'" },
  { character: "コ", romaji: "ko", tip: "Like 'ko' in 'koala'" },
  { character: "サ", romaji: "sa", tip: "Starts with an 's' sound" },
  { character: "シ", romaji: "shi", tip: "Pronounced 'she'" },
  { character: "ス", romaji: "su", tip: "Sounds like 'sue'" },
  { character: "セ", romaji: "se", tip: "Like 'say'" },
  { character: "ソ", romaji: "so", tip: "Simply 'so'" },
  { character: "タ", romaji: "ta", tip: "Starts with a 't' sound" },
  { character: "チ", romaji: "chi", tip: "Sounds like 'chee'" },
  { character: "ツ", romaji: "tsu", tip: "Pronounced as in 'tsunami'" },
  { character: "テ", romaji: "te", tip: "Like 'te' in 'ten'" },
  { character: "ト", romaji: "to", tip: "Pronounced 'toh'" },
  { character: "ナ", romaji: "na", tip: "Starts with an 'n' sound" },
  { character: "ニ", romaji: "ni", tip: "Sounds like 'knee'" },
  { character: "ヌ", romaji: "nu", tip: "Pronounced like 'new'" },
  { character: "ネ", romaji: "ne", tip: "Simply 'neh'" },
  { character: "ノ", romaji: "no", tip: "Like 'no' in English" },
  { character: "ハ", romaji: "ha", tip: "Starts with an 'h' sound" },
  { character: "ヒ", romaji: "hi", tip: "Sounds like 'he'" },
  { character: "フ", romaji: "fu", tip: "Pronounced 'foo'" },
  { character: "ヘ", romaji: "he", tip: "Like 'heh'" },
  { character: "ホ", romaji: "ho", tip: "Sounds like 'ho' in 'hope'" },
  { character: "マ", romaji: "ma", tip: "Starts with an 'm' sound" },
  { character: "ミ", romaji: "mi", tip: "Sounds like 'me'" },
  { character: "ム", romaji: "mu", tip: "Pronounced like 'moo'" },
  { character: "メ", romaji: "me", tip: "Simply 'meh'" },
  { character: "モ", romaji: "mo", tip: "Like 'mo' in 'more'" },
  { character: "ヤ", romaji: "ya", tip: "Unique 'ya' sound" },
  { character: "ユ", romaji: "yu", tip: "Sounds like 'you'" },
  { character: "ヨ", romaji: "yo", tip: "Like 'yo' in 'yoga'" },
  { character: "ラ", romaji: "ra", tip: "Starts with an 'r' sound" },
  { character: "リ", romaji: "ri", tip: "Sounds like 'ree'" },
  { character: "ル", romaji: "ru", tip: "Pronounced like 'roo'" },
  { character: "レ", romaji: "re", tip: "Simply 'reh'" },
  { character: "ロ", romaji: "ro", tip: "Pronounced like 'row'" },
  { character: "ワ", romaji: "wa", tip: "Unique 'wa' sound" },
  { character: "ヲ", romaji: "wo", tip: "Used as a particle, pronounced 'o'" },
  { character: "ン", romaji: "n", tip: "The nasal sound" },
  
  // Combination Sounds (Yōon) (21 items)
  { character: "キャ", romaji: "kya", tip: "Combine 'ki' + small 'ya'" },
  { character: "キュ", romaji: "kyu", tip: "Combine 'ki' + small 'yu'" },
  { character: "キョ", romaji: "kyo", tip: "Combine 'ki' + small 'yo'" },
  { character: "シャ", romaji: "sha", tip: "Combine 'shi' + small 'ya'" },
  { character: "シュ", romaji: "shu", tip: "Combine 'shi' + small 'yu'" },
  { character: "ショ", romaji: "sho", tip: "Combine 'shi' + small 'yo'" },
  { character: "チャ", romaji: "cha", tip: "Combine 'chi' + small 'ya'" },
  { character: "チュ", romaji: "chu", tip: "Combine 'chi' + small 'yu'" },
  { character: "チョ", romaji: "cho", tip: "Combine 'chi' + small 'yo'" },
  { character: "ニャ", romaji: "nya", tip: "Combine 'ni' + small 'ya'" },
  { character: "ニュ", romaji: "nyu", tip: "Combine 'ni' + small 'yu'" },
  { character: "ニョ", romaji: "nyo", tip: "Combine 'ni' + small 'yo'" },
  { character: "ヒャ", romaji: "hya", tip: "Combine 'hi' + small 'ya'" },
  { character: "ヒュ", romaji: "hyu", tip: "Combine 'hi' + small 'yu'" },
  { character: "ヒョ", romaji: "hyo", tip: "Combine 'hi' + small 'yo'" },
  { character: "ミャ", romaji: "mya", tip: "Combine 'mi' + small 'ya'" },
  { character: "ミュ", romaji: "myu", tip: "Combine 'mi' + small 'yu'" },
  { character: "ミョ", romaji: "myo", tip: "Combine 'mi' + small 'yo'" },
  { character: "リャ", romaji: "rya", tip: "Combine 'ri' + small 'ya'" },
  { character: "リュ", romaji: "ryu", tip: "Combine 'ri' + small 'yu'" },
  { character: "リョ", romaji: "ryo", tip: "Combine 'ri' + small 'yo'" },
  
  // Easy Words (12 items)
  { character: "ネコ", romaji: "neko", tip: "Means 'cat'" },
  { character: "イヌ", romaji: "inu", tip: "Means 'dog'" },
  { character: "アメ", romaji: "ame", tip: "Means 'rain'" },
  { character: "タマゴ", romaji: "tamago", tip: "Means 'egg'" },
  { character: "ミズ", romaji: "mizu", tip: "Means 'water'" },
  { character: "ハナ", romaji: "hana", tip: "Means 'flower'" },
  { character: "ヤマ", romaji: "yama", tip: "Means 'mountain'" },
  { character: "クルマ", romaji: "kuruma", tip: "Means 'car'" },
  { character: "デンシャ", romaji: "densha", tip: "Means 'train'" },
  { character: "サカナ", romaji: "sakana", tip: "Means 'fish'" },
  { character: "オチャ", romaji: "ocha", tip: "Means 'tea'" },
  { character: "ゴハン", romaji: "gohan", tip: "Means 'rice' or 'meal'" }
];

// Utility function to get a rank message
const getRankMessage = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage === 100) return "Master! Perfect score! 🎉";
  if (percentage >= 80) return "Expert! Almost there! 🌟";
  if (percentage >= 60) return "Intermediate! Keep practicing! 💪";
  if (percentage >= 40) return "Apprentice! You're improving! 📚";
  return "Beginner! Don't give up! 🌱";
};

const Index = () => {
  const { theme, setTheme } = useTheme();
  
  // Challenge mode: "hiragana" or "katakana"
  const [challengeMode, setChallengeMode] = useState<"hiragana" | "katakana">("hiragana");
  // Header display index for alternating between Japanese and English text
  const [headerDisplayIndex, setHeaderDisplayIndex] = useState(0);
  
  // Select the appropriate dataset based on challengeMode
  const dataset = challengeMode === "hiragana" ? hiraganaData : katakanaData;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [chances, setChances] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [shuffledData, setShuffledData] = useState(
    [...dataset].sort(() => Math.random() - 0.5).slice(0, 15)
  );
  const [showTip, setShowTip] = useState(false);
  
  // Update the header text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderDisplayIndex((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Re-shuffle data when challenge mode changes
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
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-background to-background/80 p-6 relative">
      {/* Background pattern overlay */}
      <div className="fixed inset-0 bg-japanese-pattern opacity-10 pointer-events-none" />
      {/* Top Right Controls: Light/Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
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
      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Header with smooth fade transition and alternating text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div style={{ height: "3.5rem" }}>
            <AnimatePresence mode="wait">
              <motion.h1
                key={headerTexts[headerDisplayIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl font-bold font-japanese text-foreground mb-2"
              >
                {headerTexts[headerDisplayIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <p className="text-lg text-muted-foreground">
            Master Japanese characters with elegance
          </p>
        </motion.div>
        {/* Centered Challenge Mode Toggle with interactive styling */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setChallengeMode("hiragana")}
            className={`px-6 py-2 rounded-full transition-transform transform hover:scale-105 ${
              challengeMode === "hiragana"
                ? "bg-accent text-accent-foreground shadow-lg"
                : "bg-card hover:bg-accent/10"
            }`}
          >
            Hiragana
          </button>
          <button
            onClick={() => setChallengeMode("katakana")}
            className={`px-6 py-2 rounded-full transition-transform transform hover:scale-105 ${
              challengeMode === "katakana"
                ? "bg-accent text-accent-foreground shadow-lg"
                : "bg-card hover:bg-accent/10"
            }`}
          >
            Katakana
          </button>
        </div>
        <Toaster position="top-center" />
        {/* Score and chances */}
        <ScoreBoard score={score} total={shuffledData.length} chances={chances} />
        {/* Game Card or Game Over */}
        {!isGameOver ? (
          <>
            <GameCard
              character={shuffledData[currentIndex].character}
              romaji={shuffledData[currentIndex].romaji}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
            />
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
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-accent italic"
              >
                {shuffledData[currentIndex].tip}
              </motion.p>
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
          Type the romaji (roman letters) for the character shown above
        </motion.p>
      </div>
      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground">
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
