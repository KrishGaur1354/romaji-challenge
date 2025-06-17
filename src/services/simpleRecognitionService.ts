import { Point, Stroke } from '@/types/drawing';

interface StrokePattern {
  strokes: Array<{
    direction: 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left' | 'curve' | 'hook';
    relativePosition: 'top' | 'middle' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    length: 'short' | 'medium' | 'long';
  }>;
  strokeCount: number;
}

// Comprehensive patterns for hiragana characters
const HIRAGANA_PATTERNS: Record<string, StrokePattern> = {
  'あ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'diagonal-right', relativePosition: 'center', length: 'long' },
      { direction: 'vertical', relativePosition: 'right', length: 'medium' }
    ]
  },
  'い': {
    strokeCount: 2,
    strokes: [
      { direction: 'diagonal-right', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'right', length: 'long' }
    ]
  },
  'う': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'short' },
      { direction: 'curve', relativePosition: 'center', length: 'long' }
    ]
  },
  'え': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'center', length: 'long' }
    ]
  },
  'お': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'medium' },
      { direction: 'curve', relativePosition: 'right', length: 'long' }
    ]
  },
  'か': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'right', length: 'medium' }
    ]
  },
  'き': {
    strokeCount: 4,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'short' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'horizontal', relativePosition: 'middle', length: 'short' },
      { direction: 'diagonal-right', relativePosition: 'right', length: 'medium' }
    ]
  },
  'く': {
    strokeCount: 1,
    strokes: [
      { direction: 'diagonal-left', relativePosition: 'center', length: 'long' }
    ]
  },
  'け': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'center', length: 'medium' }
    ]
  },
  'こ': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'さ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'medium' },
      { direction: 'curve', relativePosition: 'right', length: 'long' }
    ]
  },
  'し': {
    strokeCount: 1,
    strokes: [
      { direction: 'curve', relativePosition: 'center', length: 'long' }
    ]
  },
  'す': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'curve', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'せ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'medium' }
    ]
  },
  'そ': {
    strokeCount: 1,
    strokes: [
      { direction: 'curve', relativePosition: 'center', length: 'long' }
    ]
  },
  'た': {
    strokeCount: 4,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'middle', length: 'long' },
      { direction: 'vertical', relativePosition: 'center', length: 'short' }
    ]
  },
  'ち': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'curve', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'つ': {
    strokeCount: 1,
    strokes: [
      { direction: 'curve', relativePosition: 'center', length: 'medium' }
    ]
  },
  'て': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'と': {
    strokeCount: 2,
    strokes: [
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'curve', relativePosition: 'right', length: 'medium' }
    ]
  },
  'な': {
    strokeCount: 4,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'center', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'medium' }
    ]
  },
  'に': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'medium' }
    ]
  },
  'ぬ': {
    strokeCount: 2,
    strokes: [
      { direction: 'diagonal-right', relativePosition: 'left', length: 'medium' },
      { direction: 'curve', relativePosition: 'right', length: 'long' }
    ]
  },
  'ね': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'curve', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'の': {
    strokeCount: 1,
    strokes: [
      { direction: 'curve', relativePosition: 'center', length: 'long' }
    ]
  },
  'は': {
    strokeCount: 3,
    strokes: [
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'curve', relativePosition: 'center', length: 'medium' },
      { direction: 'curve', relativePosition: 'right', length: 'medium' }
    ]
  },
  'ひ': {
    strokeCount: 2,
    strokes: [
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'curve', relativePosition: 'right', length: 'medium' }
    ]
  },
  'ふ': {
    strokeCount: 4,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'short' },
      { direction: 'vertical', relativePosition: 'left', length: 'short' },
      { direction: 'horizontal', relativePosition: 'middle', length: 'short' },
      { direction: 'curve', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'へ': {
    strokeCount: 1,
    strokes: [
      { direction: 'diagonal-right', relativePosition: 'center', length: 'medium' }
    ]
  },
  'ほ': {
    strokeCount: 4,
    strokes: [
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'horizontal', relativePosition: 'top', length: 'short' },
      { direction: 'vertical', relativePosition: 'center', length: 'short' },
      { direction: 'curve', relativePosition: 'right', length: 'medium' }
    ]
  }
};

// Comprehensive patterns for katakana characters
const KATAKANA_PATTERNS: Record<string, StrokePattern> = {
  'ア': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'diagonal-left', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'right', length: 'long' }
    ]
  },
  'イ': {
    strokeCount: 2,
    strokes: [
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'right', length: 'long' }
    ]
  },
  'ウ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'short' },
      { direction: 'vertical', relativePosition: 'left', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'medium' }
    ]
  },
  'エ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'middle', length: 'short' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'long' }
    ]
  },
  'オ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'medium' }
    ]
  },
  'カ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'right', length: 'medium' }
    ]
  },
  'キ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'middle', length: 'short' },
      { direction: 'vertical', relativePosition: 'right', length: 'long' }
    ]
  },
  'ク': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'short' },
      { direction: 'diagonal-left', relativePosition: 'bottom', length: 'medium' }
    ]
  },
  'ケ': {
    strokeCount: 3,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'vertical', relativePosition: 'left', length: 'long' },
      { direction: 'diagonal-right', relativePosition: 'center', length: 'medium' }
    ]
  },
  'コ': {
    strokeCount: 2,
    strokes: [
      { direction: 'horizontal', relativePosition: 'top', length: 'medium' },
      { direction: 'horizontal', relativePosition: 'bottom', length: 'medium' }
    ]
  }
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

  private getStrokeDirection(stroke: Stroke): 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left' | 'curve' | 'hook' {
    if (stroke.length < 2) return 'horizontal';
    
    const start = stroke[0];
    const end = stroke[stroke.length - 1];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    // Check for curves by analyzing direction changes
    if (this.isCurvedStroke(stroke)) {
      return 'curve';
    }
    
    // Check for hooks
    if (this.hasHook(stroke)) {
      return 'hook';
    }
    
    // Determine primary direction
    if (absDx > absDy * 2) return 'horizontal';
    if (absDy > absDx * 2) return 'vertical';
    if (dx > 0 && dy > 0) return 'diagonal-right';
    if (dx < 0 && dy > 0) return 'diagonal-left';
    if (dx > 0 && dy < 0) return 'diagonal-left';
    return 'diagonal-right';
  }

  private isCurvedStroke(stroke: Stroke): boolean {
    if (stroke.length < 5) return false;
    
    let directionChanges = 0;
    for (let i = 2; i < stroke.length; i++) {
      const prev = stroke[i - 1];
      const curr = stroke[i];
      const next = stroke[i + 1] || curr;
      
      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
      
      const angleDiff = Math.abs(angle2 - angle1);
      if (angleDiff > Math.PI / 6 && angleDiff < Math.PI * 5 / 6) {
        directionChanges++;
      }
    }
    
    return directionChanges >= 2;
  }

  private hasHook(stroke: Stroke): boolean {
    if (stroke.length < 3) return false;
    
    const quarter = Math.floor(stroke.length / 4);
    const end = stroke.slice(-quarter);
    
    for (let i = 1; i < end.length; i++) {
      const prev = end[i - 1];
      const curr = end[i];
      
      const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      if (Math.abs(angle) > Math.PI / 3) {
        return true;
      }
    }
    
    return false;
  }

  private getStrokePosition(stroke: Stroke): 'top' | 'middle' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' {
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    
    // Calculate average position of stroke
    const avgX = stroke.reduce((sum, p) => sum + p.x, 0) / stroke.length;
    const avgY = stroke.reduce((sum, p) => sum + p.y, 0) / stroke.length;
    
    // Determine position with more precision
    const leftThird = this.canvasWidth / 3;
    const rightThird = this.canvasWidth * 2 / 3;
    const topThird = this.canvasHeight / 3;
    const bottomThird = this.canvasHeight * 2 / 3;
    
    let horizontalPos: 'left' | 'center' | 'right';
    if (avgX < leftThird) horizontalPos = 'left';
    else if (avgX > rightThird) horizontalPos = 'right';
    else horizontalPos = 'center';
    
    let verticalPos: 'top' | 'middle' | 'bottom';
    if (avgY < topThird) verticalPos = 'top';
    else if (avgY > bottomThird) verticalPos = 'bottom';
    else verticalPos = 'middle';
    
    // Combine positions for more specific location
    if (horizontalPos === 'left' && verticalPos === 'top') return 'top-left';
    if (horizontalPos === 'right' && verticalPos === 'top') return 'top-right';
    if (horizontalPos === 'left' && verticalPos === 'bottom') return 'bottom-left';
    if (horizontalPos === 'right' && verticalPos === 'bottom') return 'bottom-right';
    if (horizontalPos === 'center') return verticalPos;
    if (verticalPos === 'middle') return horizontalPos;
    return 'center';
  }

  private getStrokeLength(stroke: Stroke): 'short' | 'medium' | 'long' {
    if (stroke.length < 2) return 'short';
    
    let totalLength = 0;
    for (let i = 1; i < stroke.length; i++) {
      const dx = stroke[i].x - stroke[i - 1].x;
      const dy = stroke[i].y - stroke[i - 1].y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    
    const canvasDiagonal = Math.sqrt(this.canvasWidth * this.canvasWidth + this.canvasHeight * this.canvasHeight);
    const relativeLength = totalLength / canvasDiagonal;
    
    if (relativeLength < 0.2) return 'short';
    if (relativeLength < 0.5) return 'medium';
    return 'long';
  }

  private matchPattern(character: string): number {
    const isHiragana = character.match(/[\u3040-\u309F]/);
    const patterns = isHiragana ? HIRAGANA_PATTERNS : KATAKANA_PATTERNS;
    const pattern = patterns[character];
    
    if (!pattern) return 0.1; // Default low score for unknown characters

    // Check stroke count first (important factor)
    let score = 0;
    const strokeCountScore = pattern.strokeCount === this.strokes.length ? 0.3 : 0;
    score += strokeCountScore;

    if (this.strokes.length === 0) return 0;
    
    const maxScore = 0.7; // Remaining score to distribute
    const scorePerStroke = maxScore / Math.max(pattern.strokes.length, this.strokes.length);

    // Compare each stroke with more sophisticated matching
    const minStrokes = Math.min(this.strokes.length, pattern.strokes.length);
    for (let i = 0; i < minStrokes; i++) {
      const drawnStroke = this.strokes[i];
      const expectedStroke = pattern.strokes[i];

      let strokeScore = 0;

      // Direction matching (50% of stroke score)
      if (this.getStrokeDirection(drawnStroke) === expectedStroke.direction) {
        strokeScore += scorePerStroke * 0.5;
      }

      // Position matching (30% of stroke score)
      const drawnPosition = this.getStrokePosition(drawnStroke);
      if (drawnPosition === expectedStroke.relativePosition || 
          this.isPositionClose(drawnPosition, expectedStroke.relativePosition)) {
        strokeScore += scorePerStroke * 0.3;
      }

      // Length matching (20% of stroke score)
      if (this.getStrokeLength(drawnStroke) === expectedStroke.length) {
        strokeScore += scorePerStroke * 0.2;
      }

      score += strokeScore;
    }

    return Math.min(score, 1); // Ensure score doesn't exceed 1
  }

  private isPositionClose(pos1: string, pos2: string): boolean {
    const closePositions: Record<string, string[]> = {
      'top': ['top-left', 'top-right'],
      'bottom': ['bottom-left', 'bottom-right'],
      'left': ['top-left', 'bottom-left'],
      'right': ['top-right', 'bottom-right'],
      'center': ['middle'],
      'middle': ['center']
    };
    
    return closePositions[pos1]?.includes(pos2) || closePositions[pos2]?.includes(pos1) || false;
  }

  recognizeCharacter(expectedCharacter: string): { 
    character: string;
    probability: number;
    animationData: {
      strokes: Stroke[];
      directions: string[];
      positions: string[];
      lengths: string[];
    }
  } {
    const probability = this.matchPattern(expectedCharacter);
    
    const animationData = {
      strokes: this.strokes,
      directions: this.strokes.map(stroke => this.getStrokeDirection(stroke)),
      positions: this.strokes.map(stroke => this.getStrokePosition(stroke)),
      lengths: this.strokes.map(stroke => this.getStrokeLength(stroke))
    };

    return {
      character: expectedCharacter,
      probability,
      animationData
    };
  }
}

export const simpleRecognitionService = new SimpleRecognitionService(); 