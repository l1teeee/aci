import { GRID_COLUMNS, GRID_ROWS } from "./shape-field";

export type GridLayout = {
  dotSize: number;      // device pixels per dither dot
  barDots: number;      // dots across one bar
  rowDots: number;      // dots down one row
  columnPitch: number;  // device pixels from one bar's left edge to the next bar's left edge
  barWidth: number;     // device pixels
  rowHeight: number;    // device pixels
  originX: number;      // device pixels, left edge of the grid inside the canvas
  originY: number;      // device pixels, top edge of the grid inside the canvas
};

const REFERENCE_DOTS_ACROSS = 304;

export function computeGridLayout(canvasWidth: number, canvasHeight: number): GridLayout {
  const dotSize = Math.max(1, Math.round(canvasWidth / REFERENCE_DOTS_ACROSS));
  const cellDots = Math.max(2, Math.floor(Math.min(canvasWidth / GRID_COLUMNS, canvasHeight / GRID_ROWS) / dotSize));
  const columnPitch = cellDots * dotSize;
  const barWidth = columnPitch - dotSize;
  const rowHeight = cellDots * dotSize;
  const gridWidth = GRID_COLUMNS * columnPitch - dotSize;
  const gridHeight = GRID_ROWS * rowHeight;
  const originX = Math.floor((canvasWidth - gridWidth) / 2);
  const originY = Math.floor((canvasHeight - gridHeight) / 2);
  const barDots = cellDots - 1;
  const rowDots = cellDots;
  return { dotSize, barDots, rowDots, columnPitch, barWidth, rowHeight, originX, originY };
}
