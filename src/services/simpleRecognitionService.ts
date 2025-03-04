import { Point, Stroke } from '@/types/drawing';

interface StrokePattern {
  strokes: Array<{
    points: Point[];
    direction: 'horizontal' | 'vertical' | 'diagonal';
    relativePosition: 'top' | 'middle' | 'bottom' | 'left' | 'right' | 'center';
  }>;
}

// Simple patterns for some basic hiragana characters
const HIRAGANA_PATTERNS: Record<string, StrokePattern> = {
  'あ': {
    strokes: [
      { points: [], direction: 'horizontal', relativePosition: 'top' },
      { points: [], direction: 'diagonal', relativePosition: 'center' },
      { points: [], direction: 'vertical', relativePosition: 'right' }
    ]
  },
  'い': {
    strokes: [
      { points: [], direction: 'diagonal', relativePosition: 'center' },
      { points: [], direction: 'horizontal', relativePosition: 'bottom' }
    ]
  },
  // Add more patterns as needed
};

class SimpleRecognitionService {
  private strokes: Stroke[] = [];
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;

  setCanvasSize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  addStroke(stroke: Stroke) {
    this.strokes.push(stroke);
  }

  clearStrokes() {
    this.strokes = [];
  }

  private getStrokeDirection(stroke: Stroke): 'horizontal' | 'vertical' | 'diagonal' {
    const start = stroke[0];
    const end = stroke[stroke.length - 1];
    
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);
    
    if (dx > dy * 2) return 'horizontal';
    if (dy > dx * 2) return 'vertical';
    return 'diagonal';
  }

  private getStrokePosition(stroke: Stroke): 'top' | 'middle' | 'bottom' | 'left' | 'right' | 'center' {
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    
    // Calculate average position of stroke
    const avgX = stroke.reduce((sum, p) => sum + p.x, 0) / stroke.length;
    const avgY = stroke.reduce((sum, p) => sum + p.y, 0) / stroke.length;
    
    // Determine horizontal position
    let horizontalPos: 'left' | 'center' | 'right';
    if (avgX < centerX * 0.7) horizontalPos = 'left';
    else if (avgX > centerX * 1.3) horizontalPos = 'right';
    else horizontalPos = 'center';
    
    // Determine vertical position
    let verticalPos: 'top' | 'middle' | 'bottom';
    if (avgY < centerY * 0.7) verticalPos = 'top';
    else if (avgY > centerY * 1.3) verticalPos = 'bottom';
    else verticalPos = 'middle';
    
    // Combine positions
    if (horizontalPos === 'center') return verticalPos;
    if (verticalPos === 'middle') return horizontalPos;
    return 'center';
  }

  private matchPattern(character: string): number {
    const pattern = HIRAGANA_PATTERNS[character];
    if (!pattern) return 0;

    let score = 0;
    const maxScore = pattern.strokes.length * 2; // 2 points per stroke (direction + position)

    // Check if number of strokes matches
    if (this.strokes.length !== pattern.strokes.length) {
      return 0;
    }

    // Compare each stroke
    for (let i = 0; i < this.strokes.length; i++) {
      const drawnStroke = this.strokes[i];
      const expectedStroke = pattern.strokes[i];

      // Check direction
      if (this.getStrokeDirection(drawnStroke) === expectedStroke.direction) {
        score++;
      }

      // Check position
      if (this.getStrokePosition(drawnStroke) === expectedStroke.relativePosition) {
        score++;
      }
    }

    return score / maxScore; // Return score as percentage
  }

  recognizeCharacter(expectedCharacter: string): { 
    character: string;
    probability: number;
    animationData: {
      strokes: Stroke[];
      directions: string[];
      positions: string[];
    }
  } {
    const probability = this.matchPattern(expectedCharacter);
    
    const animationData = {
      strokes: this.strokes,
      directions: this.strokes.map(stroke => this.getStrokeDirection(stroke)),
      positions: this.strokes.map(stroke => this.getStrokePosition(stroke))
    };

    return {
      character: expectedCharacter,
      probability,
      animationData
    };
  }
}

export const simpleRecognitionService = new SimpleRecognitionService(); 