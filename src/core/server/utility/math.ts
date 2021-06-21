export function add(v1: number, v2: number): number {
    return v1 + v2;
}

export function sub(v1: number, v2: number): number {
    return v1 - v2;
}

export function multiply(v1: number, v2: number): number {
    return v1 * v2;
}

export function divide(v1: number, v2: number): number {
    return v1 / v2;
}

export function isGreater(v1: number, v2: number): boolean {
    return v1 > v2;
}

export function isLesser(v1: number, v2: number): boolean {
    return v1 < v2;
}

export function fwdX(x: number, z: number): number {
    return -Math.sin(-z) * Math.abs(Math.cos(x));
}

export function fwdY(x: number, z: number): number {
    return Math.cos(-z) * Math.abs(Math.cos(x));
}

export function fwdZ(x: number): number {
    return Math.sin(x);
}

export function distance2d(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

export function distance3d(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}

export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomFloor(min: number, max: number): number {
    return Math.floor(random(min, max));
}
