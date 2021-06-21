import { Blip } from './blip';

export interface Interaction {
    identifier?: string;
    text: string;
    blip: Blip;
    eventName?: string;
    maxRadius?: number;
    isServer?: boolean;
}
