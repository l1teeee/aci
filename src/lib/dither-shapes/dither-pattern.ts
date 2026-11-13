// Order in which the dots of a 4x4 tile take ink, indexed [dotY % 4][dotX % 4].
// Chosen so the levels read as: sparse diagonal dots, dot lattice, horizontal lines, ink with a paper dot lattice, solid ink.
const DOT_RANK = [
  [0, 4, 2, 5],
  [8, 12, 9, 13],
  [3, 6, 1, 7],
  [10, 14, 11, 15],
];
const INKED_DOTS_BY_LEVEL = [0, 2, 4, 8, 12, 16];

export function isDotInked(level: number, dotX: number, dotY: number): boolean {
  return DOT_RANK[dotY % 4][dotX % 4] < INKED_DOTS_BY_LEVEL[level];
}
