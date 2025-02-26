import { useState } from "react";
import { Book, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { hiraganaData, katakanaData } from "../data/characters";

export const Handbook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"hiragana" | "katakana">("hiragana");

  // Group characters by their row (a, ka, sa, etc.)
  const groupCharacters = (data: any[]) => {
    const groups: Record<string, any[]> = {};
    
    data.forEach(item => {
      // Extract the base sound (without diacritics)
      let baseSound = item.romaji.replace(/[^a-z]/g, '');
      
      // Special handling for 'n'
      if (baseSound === 'n' && item.romaji === 'n') {
        groups['n'] = groups['n'] || [];
        groups['n'].push(item);
        return;
      }
      
      // Group by first letter for vowels, otherwise by first consonant
      const vowels = ['a', 'i', 'u', 'e', 'o'];
      if (vowels.includes(baseSound[0])) {
        groups['vowels'] = groups['vowels'] || [];
        groups['vowels'].push(item);
      } else {
        // For consonant groups, use the first consonant
        const groupKey = baseSound[0];
        groups[groupKey] = groups[groupKey] || [];
        groups[groupKey].push(item);
      }
    });
    
    return groups;
  };

  const hiraganaGroups = groupCharacters(hiraganaData);
  const katakanaGroups = groupCharacters(katakanaData);
  
  // Get current groups based on active tab
  const currentGroups = activeTab === "hiragana" ? hiraganaGroups : katakanaGroups;
  
  // Order for the groups to appear
  const groupOrder = ['vowels', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'];
  
  return (
    <>
      {/* Handbook Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-accent text-accent-foreground rounded-full shadow-lg hover:bg-accent/90 transition-colors z-10"
        aria-label="Open Handbook"
      >
        <Book className="w-6 h-6" />
      </motion.button>
      
      {/* Handbook Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card text-card-foreground rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl mx-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {activeTab === "hiragana" ? "Hiragana" : "Katakana"} Handbook
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-accent/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setActiveTab("hiragana")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "hiragana" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/10"
                  }`}
                >
                  Hiragana
                </button>
                <button 
                  onClick={() => setActiveTab("katakana")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "katakana" 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/10"
                  }`}
                >
                  Katakana
                </button>
              </div>
              
              {/* Character Grid */}
              <div className="space-y-8">
                {groupOrder.map(group => {
                  if (!currentGroups[group]) return null;
                  
                  return (
                    <div key={group} className="border-b border-border pb-6 last:border-0">
                      <h3 className="text-xl font-semibold mb-4 capitalize">
                        {group === 'vowels' ? 'Vowels' : `${group}-row`}
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
                        {currentGroups[group].map((item, idx) => (
                          <div 
                            key={idx} 
                            className="flex flex-col items-center p-3 bg-background rounded-lg hover:bg-accent/10 transition-colors"
                          >
                            <span className="text-3xl font-japanese mb-2">{item.character}</span>
                            <span className="text-sm">{item.romaji}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Tips section */}
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Study Tips</h3>
                <ul className="text-sm space-y-2">
                  <li>• Focus on one row at a time for better retention</li>
                  <li>• Practice writing each character multiple times</li>
                  <li>• Try to associate each character with a familiar shape</li>
                  <li>• Use the game modes to test your knowledge regularly</li>
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Handbook;