import { Vector3 } from './vector';

export interface Blip {
    pos: Vector3;
    shortRange: boolean;
    sprite: number;
    color: number;
    text: string;
    scale: number;
    identifier?: string;
    uid?: string;
}
