export function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

export function withinRange(num, min, max) {
    return (num >= min && num <= max);
}