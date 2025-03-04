export interface Point {
  x: number;
  y: number;
}

export type Stroke = Point[];

export interface StrokeAnimationData {
  strokes: Stroke[];
  directions: string[];
  positions: string[];
} 