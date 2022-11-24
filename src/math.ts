export const clamp = (x: number, min: number, max: number) => Math.min(Math.max(x, min), max);

export const random = (min: number, max: number) => Math.random() * (max - min) + min;
