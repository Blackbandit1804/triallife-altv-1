import { Vector3 } from './vector';

export interface TextLabel {
    pos: Vector3;
    data: string;
    maxDistance?: number;
    uid?: string;
}
