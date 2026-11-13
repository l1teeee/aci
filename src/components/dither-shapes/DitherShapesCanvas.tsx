"use client";

import { useEffect, useRef } from "react";
import { computeGridLayout, type GridLayout } from "@/lib/dither-shapes/grid-layout";
import { GRID_COLUMNS, GRID_ROWS, LOOP_SECONDS, sampleInkLevel } from "@/lib/dither-shapes/shape-field";
import { createLevelTiles } from "./level-tiles";

const STILL_LOOP_PHASE = 0.02;

function readDevicePixelSize(entry: ResizeObserverEntry): { width: number; height: number } {
  const deviceSize = entry.devicePixelContentBoxSize?.[0];
  if (deviceSize) return { width: deviceSize.inlineSize, height: deviceSize.blockSize };
  const contentSize = entry.contentBoxSize[0];
  return {
    width: Math.round(contentSize.inlineSize * window.devicePixelRatio),
    height: Math.round(contentSize.blockSize * window.devicePixelRatio),
  };
}

type DitherShapesCanvasProps = { className?: string };

export function DitherShapesCanvas({ className }: DitherShapesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("2D canvas context is unavailable");

    let layout: GridLayout | null = null;
    let tiles: HTMLCanvasElement[] = [];
    const drawnLevels = new Uint8Array(GRID_COLUMNS * GRID_ROWS);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function drawFrame(loopPhase: number) {
      if (!layout || !context) return;
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let column = 0; column < GRID_COLUMNS; column++) {
          const level = sampleInkLevel(column, row, loopPhase);
          const index = row * GRID_COLUMNS + column;
          if (drawnLevels[index] === level) continue;
          const x = layout.originX + column * layout.columnPitch;
          const y = layout.originY + row * layout.rowHeight;
          context.clearRect(x, y, layout.barWidth, layout.rowHeight);
          context.drawImage(tiles[level], x, y);
          drawnLevels[index] = level;
        }
      }
    }

    function rebuild(deviceWidth: number, deviceHeight: number) {
      if (!deviceWidth || !deviceHeight || !canvas || !context) return;
      canvas.width = deviceWidth;
      canvas.height = deviceHeight;
      layout = computeGridLayout(deviceWidth, deviceHeight);
      const inkColor = getComputedStyle(canvas).color;
      tiles = createLevelTiles(layout, inkColor);
      drawnLevels.fill(0);
      if (prefersReducedMotion) drawFrame(STILL_LOOP_PHASE);
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = readDevicePixelSize(entries[0]);
      rebuild(width, height);
    });
    // Safari throws for the device-pixel box when it is unsupported.
    const supportsDevicePixelBox = "devicePixelContentBoxSize" in ResizeObserverEntry.prototype;
    observer.observe(canvas, { box: supportsDevicePixelBox ? "device-pixel-content-box" : "content-box" });

    let frame = 0;
    if (!prefersReducedMotion) {
      const animate = (timeMs: number) => {
        drawFrame((timeMs / 1000 / LOOP_SECONDS) % 1);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} role="img" aria-label="Animated dithered shapes" />;
}
