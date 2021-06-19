import * as alt from 'alt-client';
import { Meta } from './meta';

declare module 'alt-client' {
    export interface Player {
        meta: Partial<Meta>;
        isMenuOpen: boolean;
        isActionMenuOpen: boolean;
        isPhoneOpen: boolean;
        inVisionTime: number | null;
        closestInteraction: { type: string; position: alt.Vector3; text: string };
        otherInteraction: { position: alt.Vector3; short: string; long: string };
    }
}
