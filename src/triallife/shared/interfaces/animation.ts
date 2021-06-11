import { Vector3 } from 'alt-client';
import { AnimationFlag } from '../enums/animation';

export interface Animation {
    dict: string;
    name: string;
    flags: AnimationFlag;
    duration: number;
}

export interface JobAnimation extends Animation {
    delay?: number;
    atObjectiveStart?: boolean;
    rotation?: Vector3;
}
