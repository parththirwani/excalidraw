export type Shape = {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
} | {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
} | {
  type: "pencil";
  points: { x: number; y: number }[];
}

export interface Point {
  x: number;
  y: number;
}

export interface RectShape {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleShape {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
}

export interface PencilShape {
  type: "pencil";
  points: Point[];
}