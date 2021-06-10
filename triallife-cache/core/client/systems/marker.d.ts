import { Marker } from '../../shared/interfaces/marker';
export declare class MarkerController {
    static append(marker: Marker): void;
    static populate(markers: Array<Marker>): void;
    static remove(uid: string): void;
}
