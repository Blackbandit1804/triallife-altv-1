import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/utility/enums';
import { Marker } from '../../shared/interfaces/marker';
import Logger from '../utility/tlrpLogger';

const globalMarkers: Array<Marker> = [];

export class MarkerController {
    static add(marker: Marker) {
        globalMarkers.push(marker);
    }

    static append(marker: Marker) {
        if (!marker.uid) {
            Logger.error(`(${JSON.stringify(marker.pos)}) Marker does not have a unique id (uid).`);
            return;
        }
        MarkerController.add(marker);
        alt.emit(null, SYSTEM_EVENTS.APPEND_MARKER, marker);
    }

    static remove(uid: string): boolean {
        const index = globalMarkers.findIndex((label) => label.uid === uid);
        if (index <= -1) return false;
        alt.emit(null, SYSTEM_EVENTS.REMOVE_MARKER, uid);
        globalMarkers.splice(index, 1);
        return true;
    }

    static populateGlobalMarkers(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_MARKERS, globalMarkers);
    }
}
