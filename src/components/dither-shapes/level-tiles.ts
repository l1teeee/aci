import { isDotInked } from "@/lib/dither-shapes/dither-pattern";
import type { GridLayout } from "@/lib/dither-shapes/grid-layout";
import { DITHER_LEVEL_COUNT } from "@/lib/dither-shapes/shape-field";

export function createLevelTiles(layout: GridLayout, inkColor: string): HTMLCanvasElement[] {
  const tiles: HTMLCanvasElement[] = [];
  for (let level = 0; level < DITHER_LEVEL_COUNT; level++) {
    const tile = document.createElement("canvas");
    tile.width = layout.barWidth;
    tile.height = layout.rowHeight;
    const context = tile.getContext("2d");
    if (!context) throw new Error("2D canvas context is unavailable");
    context.fillStyle = inkColor;
    for (let dotY = 0; dotY < layout.rowDots; dotY++) {
      for (let dotX = 0; dotX < layout.barDots; dotX++) {
        if (isDotInked(level, dotX, dotY)) {
          context.fillRect(dotX * layout.dotSize, dotY * layout.dotSize, layout.dotSize, layout.dotSize);
        }
      }
    }
    tiles.push(tile);
  }
  return tiles;
}
