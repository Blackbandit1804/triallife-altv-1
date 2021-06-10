import { Vector3 } from './vector';

export interface AudioStream {
    streamName: string;
    duration: number;
    position: Vector3;
}

export interface AudioStreamData extends AudioStream {
    endTime: number;
}
