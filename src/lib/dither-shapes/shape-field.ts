import { clamp, distanceToBox, distanceToCircle, distanceToEquilateralTriangle, rotatePoint } from "./signed-distance";

export const GRID_COLUMNS = 34;
export const GRID_ROWS = 34;
export const DITHER_LEVEL_COUNT = 6;
export const LOOP_SECONDS = 24;

const TAU = Math.PI * 2;

// Share of each shape's time slot spent holding still before it morphs into the next shape.
const SHAPE_HOLD = 0.55;
// Half-width of the dithered band between solid ink and paper, in field units (the field spans -1..1).
const EDGE_SOFTNESS = 0.07;

// Echo: faint dithered rings that leave the shape's outline and fade with distance.
const ECHO_SPACING = 0.3;
const ECHO_CYCLES_PER_LOOP = 12;
const ECHO_GAIN = 0.55;
const ECHO_REACH = 0.35;

type ShapeDistance = (x: number, y: number, loopPhase: number) => number;

function circle(x: number, y: number): number {
  return distanceToCircle(x, y, 0.56);
}

function ring(x: number, y: number): number {
  return Math.abs(Math.hypot(x, y) - 0.5) - 0.15;
}

function cross(x: number, y: number): number {
  return Math.min(distanceToBox(x, y, 0.6, 0.17), distanceToBox(x, y, 0.17, 0.6));
}

function triangle(x: number, y: number): number {
  return distanceToEquilateralTriangle(x, -y - 0.1, 0.62);
}

function crescent(x: number, y: number): number {
  return Math.max(distanceToCircle(x, y, 0.6), -distanceToCircle(x - 0.26, y + 0.12, 0.47));
}

function diamond(x: number, y: number, loopPhase: number): number {
  const [rx, ry] = rotatePoint(x, y, TAU / 8 + (TAU / 4) * loopPhase);
  return distanceToBox(rx, ry, 0.44, 0.44);
}

const SHAPE_SEQUENCE: ShapeDistance[] = [circle, ring, cross, triangle, crescent, diamond];

function smoothstep(low: number, high: number, value: number): number {
  const t = clamp((value - low) / (high - low), 0, 1);
  return t * t * (3 - 2 * t);
}

function morphedDistanceAt(x: number, y: number, loopPhase: number): number {
  const position = loopPhase * SHAPE_SEQUENCE.length;
  const index = Math.floor(position) % SHAPE_SEQUENCE.length;
  const blend = smoothstep(SHAPE_HOLD, 1, position - Math.floor(position));
  const current = SHAPE_SEQUENCE[index](x, y, loopPhase);
  const next = SHAPE_SEQUENCE[(index + 1) % SHAPE_SEQUENCE.length](x, y, loopPhase);
  return current + (next - current) * blend;
}

function inkCoverageAt(distance: number, loopPhase: number): number {
  const core = 1 - smoothstep(-EDGE_SOFTNESS, EDGE_SOFTNESS, distance);
  const outside = Math.max(distance, 0);
  const ripple = 0.5 + 0.5 * Math.cos(TAU * (outside / ECHO_SPACING - ECHO_CYCLES_PER_LOOP * loopPhase));
  const echo = ECHO_GAIN * ripple * Math.exp(-outside / ECHO_REACH);
  return core + (1 - core) * echo;
}

export function sampleInkLevel(column: number, row: number, loopPhase: number): number {
  const x = ((column + 0.5) / GRID_COLUMNS) * 2 - 1;
  const y = ((row + 0.5) / GRID_ROWS) * 2 - 1;
  const distance = morphedDistanceAt(x, y, loopPhase);
  const coverage = inkCoverageAt(distance, loopPhase);
  return clamp(Math.floor(coverage * DITHER_LEVEL_COUNT), 0, DITHER_LEVEL_COUNT - 1);
}
