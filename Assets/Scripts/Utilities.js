// Here are helper functions that can be used anywhere
// All of them are pure functions

export function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

export function withinRange(num, min, max) {
    return (num >= min && num <= max);
}

export function lerp(start, end, alpha) {
    return start + alpha * (end - start);
}

export function distance(v1, v2) {
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}