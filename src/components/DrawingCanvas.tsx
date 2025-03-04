import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { simpleRecognitionService } from '@/services/simpleRecognitionService';
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
  size = 300,
  lineColor = '#6366f1',
  lineWidth = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Set up canvas and recognition service on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    // Initialize recognition service with canvas size
    simpleRecognitionService.setCanvasSize(canvas.width, canvas.height);
  }, [lineWidth, lineColor]);

  // Drawing functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      simpleRecognitionService.addStroke(currentStroke);
      setCurrentStroke([]);
    }
    setIsDrawing(false);
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setPrediction(null);
    setShowAnimation(false);

    try {
      const result = simpleRecognitionService.recognizeCharacter(expectedCharacter);
      setPrediction(result);
      setShowAnimation(true);
      
      if (result.probability >= 0.7) {
        onCorrect();
      } else {
        onIncorrect();
      }
    } catch (error) {
      console.error('Prediction error:', error);
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
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
    setShowAnimation(false);
    simpleRecognitionService.clearStrokes();
  };

  return (
    <motion.div 
      className="flex flex-col items-center" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <canvas 
          ref={canvasRef}
          width={size}
          height={size}
          className="border-2 border-accent rounded-lg shadow-lg bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {showAnimation && prediction && (
          <div className="absolute top-0 left-0">
            <StrokeAnimation
              animationData={prediction.animationData}
              width={size}
              height={size}
            />
          </div>
        )}
      </div>
      
      {/* Prediction results */}
      {prediction && (
        <motion.div 
          className="mt-2 text-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm">
            Match accuracy: <span className="font-bold">{(prediction.probability * 100).toFixed(0)}%</span>
          </p>
          {prediction.probability < 0.7 && (
            <p className="text-xs text-muted-foreground mt-1">
              Try to match the stroke pattern of <span className="font-medium">{expectedCharacter}</span>
            </p>
          )}
        </motion.div>
      )}
      
      <div className="flex gap-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCanvas}
          className="px-4 py-2 rounded-full bg-card hover:bg-accent/10 transition-colors"
          disabled={isPredicting}
        >
          Clear
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePredict}
          className="px-4 py-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shadow-md"
          disabled={isPredicting}
        >
          {isPredicting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
          ) : "Check Character"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DrawingCanvas;