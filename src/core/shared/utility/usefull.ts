import { Vector2, Vector3 } from '../interfaces/vector';

export default function isFunction(funcOrClass: ClassDecorator | Function) {
    const propertyNames = Object.getOwnPropertyNames(funcOrClass);
    return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
}

export function deepCloneObject<T>(data: object): T {
    return JSON.parse(JSON.stringify(data));
}

export function isFlagEnabled(flags: Permissions | number, flagToCheck: Permissions | number): boolean {
    let currentFlags: number = flags as number;
    let currentFlagToCheck: number = flagToCheck as number;
    if ((currentFlags & currentFlagToCheck) !== 0) return true;
    return false;
}

export function distance(vector1: Vector3, vector2: Vector3) {
    if (vector1 === undefined || vector2 === undefined) throw new Error('AddVector => vector1 or vector2 is undefined');
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2));
}

export function distance2d(vector1: Vector2, vector2: Vector2) {
    if (vector1 === undefined || vector2 === undefined) throw new Error('AddVector => vector1 or vector2 is undefined');
    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}

export function getClosestVector(pos: Vector3, arrayOfPositions: Vector3[]) {
    arrayOfPositions.sort((a, b) => distance(pos, a) - distance(pos, b));
    return arrayOfPositions[0];
}

export function getClosestVectorByPos<T>(pos: Vector3, arrayOfPositions: T[], posVariable: string = 'pos'): T {
    arrayOfPositions.sort((a, b) => distance(pos, a[posVariable]) - distance(pos, b[posVariable]));
    return arrayOfPositions[0];
}

export function getClosestTypes<T>(
    pos: Vector3,
    elements: Array<{ pos: Vector3; valid: boolean }>,
    maxDistance: number,
    mustHaveProperties: Array<string> = [],
    positionName: string = 'pos'
): Array<T> {
    const newElements = [];
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i] || !elements[i].valid) continue;
        if (mustHaveProperties.length >= 1) {
            let isValid = true;
            for (let x = 0; x < mustHaveProperties.length; x++) {
                if (!elements[i][mustHaveProperties[x]]) {
                    isValid = false;
                    break;
                }
            }
            if (!isValid) continue;
        }
        if (distance2d(pos, elements[i][positionName]) > maxDistance) continue;
        newElements.push(elements[i]);
    }
    return newElements as Array<T>;
}
