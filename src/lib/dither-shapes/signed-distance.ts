export function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

export function distanceToCircle(x: number, y: number, radius: number): number {
  return Math.hypot(x, y) - radius;
}

export function distanceToBox(x: number, y: number, halfWidth: number, halfHeight: number): number {
  const dx = Math.abs(x) - halfWidth;
  const dy = Math.abs(y) - halfHeight;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0);
}

export function distanceToEquilateralTriangle(x: number, y: number, radius: number): number {
  const k = Math.sqrt(3);
  let px = Math.abs(x) - radius;
  let py = y + radius / k;
  if (px + k * py > 0) {
    [px, py] = [(px - k * py) / 2, (-k * px - py) / 2];
  }
  px = px - clamp(px, -2 * radius, 0);
  return -Math.hypot(px, py) * (py >= 0 ? 1 : -1);
}

export function rotatePoint(x: number, y: number, angle: number): [number, number] {
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
}
