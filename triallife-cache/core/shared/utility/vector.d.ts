import { Vector2, Vector3 } from '../interfaces/vector';
export declare function distance(vector1: Vector3, vector2: Vector3): number;
export declare function distance2d(vector1: Vector2, vector2: Vector2): number;
export declare function getClosestVector(pos: Vector3, arrayOfPositions: Vector3[]): Vector3;
export declare function getClosestVectorByPos<T>(pos: Vector3, arrayOfPositions: T[], posVariable?: string): T;
export declare function getClosestTypes<T>(pos: Vector3, elements: Array<{
    pos: Vector3;
    valid: boolean;
}>, maxDistance: number, mustHaveProperties?: Array<string>, positionName?: string): Array<T>;
