import * as alt from 'alt-server';
import { Blip } from '../../shared/interfaces/blip';
export declare class BlipController {
    static add(blip: Blip): void;
    static append(blip: Blip): void;
    static remove(uid: string): boolean;
    static populateGlobalBlips(player: alt.Player): void;
}
