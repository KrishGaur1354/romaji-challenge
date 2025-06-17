import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mlRecognitionService } from '@/services/mlRecognitionService';
import StrokeAnimation from './StrokeAnimation';
import type { Point, Stroke } from '@/types/drawing';

// Character mapping between model output indices and actual characters
// This would be loaded from your processed character_map.json
const CHARACTER_MAP = {
  // This is a simplified example - your actual map would have many more entries
  // Format: index: character
  0: 'あ', 1: 'い', 2: 'う', 3: 'え', 4: 'お',
  5: 'か', 6: 'き', 7: 'く', 8: 'け', 9: 'こ',
  // ... more hiragana
  
  // Katakana indices would follow
  46: 'ア', 47: 'イ', 48: 'ウ', 49: 'エ', 50: 'オ',
  // ... more katakana
};

// Reverse mapping for looking up indices by character
const REVERSE_CHARACTER_MAP = Object.entries(CHARACTER_MAP).reduce(
  (map, [index, char]) => {
    map[char] = parseInt(index);
    return map;
  }, 
  {}
);

interface DrawingCanvasProps {
  expectedCharacter: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  size?: number;
  lineColor?: string;
  lineWidth?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  expectedCharacter,
  onCorrect,
  onIncorrect,
  size = 280,
  lineColor = '#6366f1',
  lineWidth = 3
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive canvas size
  const canvasSize = Math.min(size, window.innerWidth - 60);

  // Set up canvas and recognition service on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas with better quality for mobile
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = canvasSize * devicePixelRatio;
    canvas.height = canvasSize * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = isMobile ? lineWidth + 1 : lineWidth; // Slightly thicker on mobile
    ctx.strokeStyle = lineColor;
    ctx.imageSmoothingEnabled = true;

    // Initialize recognition service with canvas size
    mlRecognitionService.setCanvasSize(canvasSize, canvasSize);
  }, [lineWidth, lineColor, canvasSize, isMobile]);

  // Get coordinates from touch or mouse event
  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches.length > 0) {
        // For touchend events
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        return { x: 0, y: 0 };
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Drawing functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getEventCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
    setHasStrokes(true);
    
    // Prevent scrolling on mobile
    if ('touches' in e) {
      document.body.style.overflow = 'hidden';
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getEventCoordinates(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const stopDrawing = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isDrawing && currentStroke.length > 0) {
      mlRecognitionService.addStroke(currentStroke);
      setCurrentStroke([]);
    }
    setIsDrawing(false);
    
    // Re-enable scrolling on mobile
    document.body.style.overflow = '';
  };

  const handlePredict = async () => {
    if (!hasStrokes) return;
    
    setIsPredicting(true);
    setPrediction(null);
    setShowAnimation(false);

    try {
      const result = await mlRecognitionService.recognizeCharacter(expectedCharacter);
      setPrediction(result);
      setShowAnimation(true);
      
      // Auto advance if accuracy is high enough
      setTimeout(() => {
        if (result.probability >= 0.6) { // Slightly lower threshold for mobile
          onCorrect();
        } else {
          onIncorrect();
        }
      }, 1500);
    } catch (error) {
      console.error('Prediction error:', error);
      onIncorrect();
    } finally {
      setIsPredicting(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    setPrediction(null);
    setShowAnimation(false);
    setHasStrokes(false);
    mlRecognitionService.clearStrokes();
  };

  const getAccuracyColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-500';
    if (probability >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAccuracyMessage = (probability: number) => {
    if (probability >= 0.8) return 'Excellent!';
    if (probability >= 0.6) return 'Good attempt!';
    return 'Keep practicing!';
  };

  return (
    <motion.div 
      className="flex flex-col items-center space-y-4 sm:space-y-6 w-full" 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        {/* Canvas container with refined styling */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-accent/20 bg-gradient-to-br from-white to-gray-50"
          whileHover={{ scale: isMobile ? 1 : 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <canvas 
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            className="block touch-none cursor-crosshair"
            style={{ width: canvasSize, height: canvasSize }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
          
          {/* Grid overlay for better guidance - less visible on mobile */}
          <div className="absolute inset-0 pointer-events-none">
            <svg 
              width={canvasSize} 
              height={canvasSize} 
              className={`${isMobile ? 'opacity-5' : 'opacity-10'}`}
              viewBox={`0 0 ${canvasSize} ${canvasSize}`}
            >
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Center guides */}
              <line x1={canvasSize/2} y1="0" x2={canvasSize/2} y2={canvasSize} stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <line x1="0" y1={canvasSize/2} x2={canvasSize} y2={canvasSize/2} stroke="currentColor" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>
        </motion.div>
        
        {/* Stroke animation overlay */}
        {showAnimation && prediction && (
          <motion.div 
            className="absolute top-0 left-0 rounded-2xl sm:rounded-3xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <StrokeAnimation
              animationData={prediction.animationData}
              width={canvasSize}
              height={canvasSize}
            />
          </motion.div>
        )}
      </div>
      
      {/* Prediction display */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-2 sm:space-y-3 bg-background/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-accent/20"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg sm:text-xl">Prediction:</span>
            <span className="text-2xl sm:text-3xl font-japanese">{prediction.character}</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className={`text-base sm:text-lg font-medium ${getAccuracyColor(prediction.probability)}`}>
              {getAccuracyMessage(prediction.probability)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Confidence: {Math.round(prediction.probability * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">
              Engine: {mlRecognitionService.getModelInfo()}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Action buttons with improved mobile styling */}
      <div className="flex gap-3 sm:gap-4 w-full max-w-xs">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="flex-1 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-sm hover:bg-accent/10 transition-all duration-300 border border-accent/20 shadow-md"
          disabled={isPredicting}
        >
          <span className="text-sm font-medium">Clear</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePredict}
          className={`flex-1 px-4 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-medium shadow-lg transition-all duration-300 ${
            hasStrokes 
              ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:shadow-xl" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={isPredicting || !hasStrokes}
        >
          {isPredicting ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm">Analyzing...</span>
            </span>
          ) : (
            <span className="text-sm sm:text-base">Check Drawing</span>
          )}
        </motion.button>
      </div>
      
      {/* Drawing instructions */}
      <motion.p 
        className="text-xs text-muted-foreground text-center max-w-sm leading-relaxed px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isMobile 
          ? "Touch and drag to draw. Follow proper stroke order for best results."
          : "Draw the character stroke by stroke. Follow the traditional stroke order for best results."
        }
      </motion.p>
    </motion.div>
  );
};

export default DrawingCanvas;