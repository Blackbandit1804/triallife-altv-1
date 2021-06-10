import { Vector3 } from './vector';

export interface Vehicle {
    uid: string;
    model: string;
    position: Vector3;
    rotation: Vector3;
    fuel?: number;
    color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}
