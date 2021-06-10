import * as alt from 'alt-server';
import { Marker } from '../../shared/interfaces/marker';
export declare class MarkerController {
    static add(marker: Marker): void;
    static append(marker: Marker): void;
    static remove(uid: string): boolean;
    static populateGlobalMarkers(player: alt.Player): void;
}
