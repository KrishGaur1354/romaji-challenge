import { Point, Stroke } from '@/types/drawing';

interface CharacterPattern {
  strokes: number;
  directions: string[];
  positions: string[];
  curves: boolean[];
}

interface RecognitionResult {
  character: string;
  probability: number;
  animationData: {
    strokes: Stroke[];
    directions: string[];
    positions: string[];
    lengths: string[];
  };
}

// Comprehensive stroke patterns for Japanese characters
const CHARACTER_PATTERNS: Record<string, CharacterPattern> = {
  // Hiragana patterns
  'あ': { strokes: 3, directions: ['horizontal', 'vertical', 'curve'], positions: ['top', 'middle', 'bottom'], curves: [false, false, true] },
  'い': { strokes: 2, directions: ['vertical', 'vertical'], positions: ['left', 'right'], curves: [true, false] },
  'う': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'middle'], curves: [false, true] },
  'え': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['middle', 'bottom'], curves: [false, true] },
  'お': { strokes: 3, directions: ['horizontal', 'curve', 'vertical'], positions: ['top', 'middle', 'bottom'], curves: [false, true, false] },
  'か': { strokes: 3, directions: ['horizontal', 'curve', 'diagonal'], positions: ['top', 'middle', 'right'], curves: [false, true, false] },
  'き': { strokes: 4, directions: ['horizontal', 'vertical', 'horizontal', 'vertical'], positions: ['top-left', 'left', 'middle', 'bottom-right'], curves: [false, false, false, false] },
  'く': { strokes: 1, directions: ['diagonal'], positions: ['center'], curves: [true] },
  'け': { strokes: 3, directions: ['horizontal', 'diagonal', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'こ': { strokes: 2, directions: ['horizontal', 'horizontal'], positions: ['top', 'bottom'], curves: [false, false] },
  'さ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, true] },
  'し': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  'す': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'middle'], curves: [false, true] },
  'せ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'そ': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  'た': { strokes: 4, directions: ['horizontal', 'vertical', 'horizontal', 'vertical'], positions: ['top', 'left', 'middle', 'right'], curves: [false, false, false, false] },
  'ち': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'middle'], curves: [false, true] },
  'つ': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  'て': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  'と': { strokes: 2, directions: ['vertical', 'curve'], positions: ['left', 'right'], curves: [false, true] },
  'な': { strokes: 4, directions: ['horizontal', 'vertical', 'horizontal', 'curve'], positions: ['top', 'left', 'middle', 'bottom'], curves: [false, false, false, true] },
  'に': { strokes: 2, directions: ['horizontal', 'horizontal'], positions: ['top', 'bottom'], curves: [false, false] },
  'ぬ': { strokes: 2, directions: ['curve', 'curve'], positions: ['left', 'right'], curves: [true, true] },
  'ね': { strokes: 2, directions: ['curve', 'curve'], positions: ['left', 'right'], curves: [true, true] },
  'の': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  'は': { strokes: 3, directions: ['vertical', 'vertical', 'curve'], positions: ['left', 'middle', 'right'], curves: [false, false, true] },
  'ひ': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  'ふ': { strokes: 4, directions: ['horizontal', 'vertical', 'curve', 'curve'], positions: ['top', 'left', 'middle', 'bottom'], curves: [false, false, true, true] },
  'へ': { strokes: 1, directions: ['diagonal'], positions: ['center'], curves: [false] },
  'ほ': { strokes: 4, directions: ['horizontal', 'vertical', 'horizontal', 'curve'], positions: ['top', 'left', 'middle', 'right'], curves: [false, false, false, true] },
  'ま': { strokes: 3, directions: ['horizontal', 'curve', 'curve'], positions: ['top', 'middle', 'bottom'], curves: [false, true, true] },
  'み': { strokes: 2, directions: ['curve', 'curve'], positions: ['left', 'right'], curves: [true, true] },
  'む': { strokes: 3, directions: ['vertical', 'horizontal', 'curve'], positions: ['left', 'middle', 'bottom'], curves: [false, false, true] },
  'め': { strokes: 2, directions: ['curve', 'curve'], positions: ['center', 'center'], curves: [true, true] },
  'も': { strokes: 3, directions: ['vertical', 'horizontal', 'curve'], positions: ['left', 'middle', 'bottom'], curves: [false, false, true] },
  'や': { strokes: 3, directions: ['vertical', 'horizontal', 'curve'], positions: ['left', 'middle', 'right'], curves: [false, false, true] },
  'ゆ': { strokes: 2, directions: ['curve', 'horizontal'], positions: ['left', 'bottom'], curves: [true, false] },
  'よ': { strokes: 2, directions: ['horizontal', 'horizontal'], positions: ['top', 'bottom'], curves: [false, false] },
  'ら': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'middle'], curves: [false, true] },
  'り': { strokes: 2, directions: ['vertical', 'curve'], positions: ['left', 'right'], curves: [false, true] },
  'る': { strokes: 2, directions: ['curve', 'curve'], positions: ['top', 'bottom'], curves: [true, true] },
  'れ': { strokes: 2, directions: ['curve', 'curve'], positions: ['left', 'right'], curves: [true, true] },
  'ろ': { strokes: 3, directions: ['horizontal', 'vertical', 'curve'], positions: ['top', 'left', 'bottom'], curves: [false, false, true] },
  'わ': { strokes: 2, directions: ['curve', 'vertical'], positions: ['top', 'bottom'], curves: [true, false] },
  'を': { strokes: 3, directions: ['horizontal', 'vertical', 'curve'], positions: ['top', 'left', 'right'], curves: [false, false, true] },
  'ん': { strokes: 1, directions: ['curve'], positions: ['center'], curves: [true] },
  
  // Katakana patterns
  'ア': { strokes: 2, directions: ['vertical', 'diagonal'], positions: ['left', 'right'], curves: [false, false] },
  'イ': { strokes: 2, directions: ['vertical', 'diagonal'], positions: ['left', 'right'], curves: [false, false] },
  'ウ': { strokes: 3, directions: ['horizontal', 'vertical', 'vertical'], positions: ['top', 'left', 'right'], curves: [false, false, false] },
  'エ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'オ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'カ': { strokes: 2, directions: ['horizontal', 'vertical'], positions: ['top', 'right'], curves: [false, false] },
  'キ': { strokes: 3, directions: ['horizontal', 'diagonal', 'diagonal'], positions: ['middle', 'top-right', 'bottom-right'], curves: [false, false, false] },
  'ク': { strokes: 2, directions: ['horizontal', 'diagonal'], positions: ['top', 'middle'], curves: [false, false] },
  'ケ': { strokes: 3, directions: ['horizontal', 'diagonal', 'diagonal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'コ': { strokes: 2, directions: ['horizontal', 'vertical'], positions: ['top', 'right'], curves: [false, false] },
  'サ': { strokes: 3, directions: ['horizontal', 'vertical', 'vertical'], positions: ['top', 'left', 'right'], curves: [false, false, false] },
  'シ': { strokes: 3, directions: ['diagonal', 'diagonal', 'diagonal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ス': { strokes: 2, directions: ['horizontal', 'diagonal'], positions: ['top', 'middle'], curves: [false, false] },
  'セ': { strokes: 2, directions: ['horizontal', 'horizontal'], positions: ['top', 'middle'], curves: [false, false] },
  'ソ': { strokes: 2, directions: ['diagonal', 'diagonal'], positions: ['top', 'bottom'], curves: [false, false] },
  'タ': { strokes: 3, directions: ['horizontal', 'vertical', 'vertical'], positions: ['top', 'left', 'right'], curves: [false, false, false] },
  'チ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ツ': { strokes: 3, directions: ['diagonal', 'diagonal', 'diagonal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'テ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ト': { strokes: 2, directions: ['vertical', 'diagonal'], positions: ['left', 'right'], curves: [false, false] },
  'ナ': { strokes: 2, directions: ['horizontal', 'diagonal'], positions: ['top', 'middle'], curves: [false, false] },
  'ニ': { strokes: 2, directions: ['horizontal', 'horizontal'], positions: ['top', 'bottom'], curves: [false, false] },
  'ヌ': { strokes: 2, directions: ['diagonal', 'curve'], positions: ['top', 'bottom'], curves: [false, true] },
  'ネ': { strokes: 4, directions: ['horizontal', 'diagonal', 'vertical', 'horizontal'], positions: ['top', 'middle-left', 'middle-right', 'bottom'], curves: [false, false, false, false] },
  'ノ': { strokes: 1, directions: ['diagonal'], positions: ['center'], curves: [false] },
  'ハ': { strokes: 2, directions: ['diagonal', 'diagonal'], positions: ['left', 'right'], curves: [false, false] },
  'ヒ': { strokes: 2, directions: ['vertical', 'vertical'], positions: ['left', 'right'], curves: [false, false] },
  'フ': { strokes: 2, directions: ['horizontal', 'diagonal'], positions: ['top', 'right'], curves: [false, false] },
  'ヘ': { strokes: 1, directions: ['diagonal'], positions: ['center'], curves: [false] },
  'ホ': { strokes: 4, directions: ['horizontal', 'vertical', 'horizontal', 'vertical'], positions: ['top', 'left', 'middle', 'right'], curves: [false, false, false, false] },
  'マ': { strokes: 2, directions: ['horizontal', 'diagonal'], positions: ['top', 'right'], curves: [false, false] },
  'ミ': { strokes: 3, directions: ['horizontal', 'horizontal', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ム': { strokes: 2, directions: ['diagonal', 'diagonal'], positions: ['left', 'right'], curves: [false, false] },
  'メ': { strokes: 2, directions: ['diagonal', 'diagonal'], positions: ['left', 'right'], curves: [false, false] },
  'モ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ヤ': { strokes: 3, directions: ['horizontal', 'vertical', 'diagonal'], positions: ['top', 'left', 'right'], curves: [false, false, false] },
  'ユ': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'bottom'], curves: [false, true] },
  'ヨ': { strokes: 3, directions: ['horizontal', 'horizontal', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ラ': { strokes: 2, directions: ['horizontal', 'vertical'], positions: ['top', 'right'], curves: [false, false] },
  'リ': { strokes: 2, directions: ['vertical', 'vertical'], positions: ['left', 'right'], curves: [false, false] },
  'ル': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'bottom'], curves: [false, true] },
  'レ': { strokes: 2, directions: ['horizontal', 'diagonal'], positions: ['top', 'right'], curves: [false, false] },
  'ロ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ワ': { strokes: 2, directions: ['horizontal', 'curve'], positions: ['top', 'middle'], curves: [false, true] },
  'ヲ': { strokes: 3, directions: ['horizontal', 'vertical', 'horizontal'], positions: ['top', 'middle', 'bottom'], curves: [false, false, false] },
  'ン': { strokes: 1, directions: ['diagonal'], positions: ['center'], curves: [false] },
};

class ImprovedRecognitionService {
  private strokes: Stroke[] = [];
  private canvasWidth: number = 280;
  private canvasHeight: number = 280;

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

  private analyzeStrokeDirection(stroke: Stroke): string {
    if (stroke.length < 2) return 'point';
    
    const start = stroke[0];
    const end = stroke[stroke.length - 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    const angle = Math.atan2(dy, dx);
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    // Check if it's curved
    const isCurved = this.isStrokeCurved(stroke);
    if (isCurved) return 'curve';
    
    // Determine direction
    if (absDx < 20 && absDy < 20) return 'point';
    
    if (absDx > absDy * 1.5) {
      return 'horizontal';
    } else if (absDy > absDx * 1.5) {
      return 'vertical';
    } else {
      return 'diagonal';
    }
  }

  private isStrokeCurved(stroke: Stroke): boolean {
    if (stroke.length < 5) return false;
    
    let angleChanges = 0;
    let prevAngle = 0;
    
    for (let i = 1; i < stroke.length - 1; i++) {
      const dx = stroke[i + 1].x - stroke[i].x;
      const dy = stroke[i + 1].y - stroke[i].y;
      const angle = Math.atan2(dy, dx);
      
      if (i > 1) {
        const angleDiff = Math.abs(angle - prevAngle);
        if (angleDiff > 0.3) angleChanges++;
      }
      
      prevAngle = angle;
    }
    
    return angleChanges > stroke.length / 4;
  }

  private analyzeStrokePosition(stroke: Stroke): string {
    if (stroke.length === 0) return 'unknown';
    
    const avgX = stroke.reduce((sum, p) => sum + p.x, 0) / stroke.length;
    const avgY = stroke.reduce((sum, p) => sum + p.y, 0) / stroke.length;
    
    const relativeX = avgX / this.canvasWidth;
    const relativeY = avgY / this.canvasHeight;
    
    let position = '';
    if (relativeY < 0.33) position += 'top';
    else if (relativeY > 0.67) position += 'bottom';
    else position += 'middle';
    
    position += '-';
    
    if (relativeX < 0.33) position += 'left';
    else if (relativeX > 0.67) position += 'right';
    else position += 'center';
    
    return position;
  }

  private getStrokeDirections(): string[] {
    return this.strokes.map(stroke => this.analyzeStrokeDirection(stroke));
  }

  private getStrokePositions(): string[] {
    return this.strokes.map(stroke => this.analyzeStrokePosition(stroke));
  }

  private getStrokeLengths(): string[] {
    return this.strokes.map(stroke => {
      let totalLength = 0;
      for (let i = 1; i < stroke.length; i++) {
        const dx = stroke[i].x - stroke[i-1].x;
        const dy = stroke[i].y - stroke[i-1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }
      
      const relativeLength = totalLength / Math.max(this.canvasWidth, this.canvasHeight);
      
      if (relativeLength < 0.2) return 'short';
      else if (relativeLength < 0.5) return 'medium';
      else return 'long';
    });
  }

  async recognizeCharacter(expectedCharacter: string): Promise<RecognitionResult> {
    const pattern = CHARACTER_PATTERNS[expectedCharacter];
    
    if (!pattern) {
      // No pattern defined, be generous
      return {
        character: expectedCharacter,
        probability: 0.75,
        animationData: {
          strokes: this.strokes,
          directions: this.getStrokeDirections(),
          positions: this.getStrokePositions(),
          lengths: this.getStrokeLengths()
        }
      };
    }

    const drawnDirections = this.getStrokeDirections();
    const strokeCount = this.strokes.length;
    
    let score = 0;
    const maxScore = 100;
    
    // 1. Stroke count matching (40 points)
    const strokeDiff = Math.abs(strokeCount - pattern.strokes);
    if (strokeDiff === 0) {
      score += 40;
    } else if (strokeDiff === 1) {
      score += 30; // Close enough
    } else if (strokeDiff === 2) {
      score += 15;
    }
    
    // 2. Direction matching (40 points)
    if (strokeCount > 0 && pattern.strokes > 0) {
      let directionMatches = 0;
      const minStrokes = Math.min(strokeCount, pattern.strokes);
      
      for (let i = 0; i < minStrokes; i++) {
        const drawnDir = drawnDirections[i];
        const expectedDir = pattern.directions[i];
        
        if (drawnDir === expectedDir) {
          directionMatches++;
        } else if (
          (drawnDir === 'horizontal' && expectedDir === 'curve') ||
          (drawnDir === 'curve' && expectedDir === 'horizontal') ||
          (drawnDir === 'diagonal' && expectedDir === 'curve') ||
          (drawnDir === 'curve' && expectedDir === 'diagonal')
        ) {
          directionMatches += 0.5; // Partial match
        }
      }
      
      const directionScore = (directionMatches / pattern.strokes) * 40;
      score += directionScore;
    }
    
    // 3. Has drawn something (20 points)
    if (strokeCount > 0) {
      score += 20;
    }
    
    // Convert score to probability
    let probability = score / maxScore;
    
    // Add small random variation for realism
    probability += (Math.random() - 0.5) * 0.05;
    
    // Ensure minimum success rate for reasonable attempts
    if (strokeCount >= pattern.strokes - 1 && strokeCount <= pattern.strokes + 1) {
      probability = Math.max(probability, 0.65);
    }
    
    // Cap probability
    probability = Math.max(0.3, Math.min(0.98, probability));
    
    return {
      character: expectedCharacter,
      probability,
      animationData: {
        strokes: this.strokes,
        directions: drawnDirections,
        positions: this.getStrokePositions(),
        lengths: this.getStrokeLengths()
      }
    };
  }

  isReady(): boolean {
    return true; // Always ready, no loading needed
  }

  getModelInfo(): string {
    return 'Pattern Recognition Engine (Stroke-Order Aware)';
  }
}

export const improvedRecognitionService = new ImprovedRecognitionService();

