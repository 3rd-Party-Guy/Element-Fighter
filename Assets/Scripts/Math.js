export function lerp(from, to, alpha) {
  return from + alpha * (to - from);
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}