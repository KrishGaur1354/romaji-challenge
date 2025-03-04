import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StrokeAnimationData } from '@/types/drawing';

interface StrokeAnimationProps {
  animationData: StrokeAnimationData;
  width: number;
  height: number;
}

const StrokeAnimation: React.FC<StrokeAnimationProps> = ({
  animationData,
  width,
  height
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw each stroke with animation
    animationData.strokes.forEach((stroke, index) => {
      const direction = animationData.directions[index];
      const position = animationData.positions[index];

      // Draw the stroke
      ctx.beginPath();
      stroke.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  }, [animationData, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute top-0 left-0"
      />
      <AnimatePresence>
        {animationData.strokes.map((stroke, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0.8]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              ease: "easeOut"
            }}
            style={{
              left: stroke[0].x,
              top: stroke[0].y,
              width: 20,
              height: 20,
              background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default StrokeAnimation; 