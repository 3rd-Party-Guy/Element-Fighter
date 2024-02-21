export function lerp(from, to, alpha) {
  return from + alpha * (to - from);
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  return Math.sqrt(dx * dx + dy * dy);
}

export function withinRange(x, min, max) {
  return (x >= min && x <= max);
}