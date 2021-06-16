import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/marker';
import Logger from '../utility/tlrp-logger';

const globalMarkers: Array<Marker> = [];

export class MarkerManager {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {Marker} marker
     * @memberof MarkerManager
     */
    static add(marker: Marker) {
        globalMarkers.push(marker);
    }

    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {Marker} label
     * @memberof MarkerManager
     */
    static append(marker: Marker) {
        if (!marker.uid) {
            Logger.error(`(${JSON.stringify(marker.pos)}) Marker does not have a unique id (uid).`);
            return;
        }

        MarkerManager.add(marker);
        alt.emit(null, SystemEvent.APPEND_MARKER, marker);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelManager
     */
    static remove(uid: string): boolean {
        const index = globalMarkers.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emit(null, SystemEvent.REMOVE_MARKER, uid);
        globalMarkers.splice(index, 1);
        return true;
    }

    static populateGlobalMarkers(player: alt.Player) {
        player.emit(SystemEvent.POPULATE_MARKERS, globalMarkers);
    }
}
