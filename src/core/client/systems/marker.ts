import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/enums/system';
import { Marker } from '../../shared/interfaces/marker';
import { distance2d } from '../../shared/utility/vector';
import { drawMarker } from '../utility/marker';

let addedMarkers: Array<Marker> = [];
let isRemoving = false;
let interval;

export class MarkerManager {
    /**
     * Add a single marker.
     * @static
     * @param {Marker} marker
     * @memberof MarkerManager
     */
    static append(marker: Marker) {
        if (!marker.uid) {
            alt.logError(`(${JSON.stringify(marker.pos)}) Marker is missing uid.`);
            return;
        }

        addedMarkers.push(marker);

        if (!interval) {
            interval = alt.setInterval(handleDrawMarkers, 0);
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<Marker>} markers
     * @memberof MarkerManager
     */
    static populate(markers: Array<Marker>) {
        addedMarkers = addedMarkers.concat(markers);

        if (!interval) {
            interval = alt.setInterval(handleDrawMarkers, 0);
        }
    }

    /**
     * Remove a marker from being drawn.
     * @static
     * @param {string} uid
     * @return {*}
     * @memberof MarkerManager
     */
    static remove(uid: string) {
        isRemoving = true;

        const index = addedMarkers.findIndex((marker) => marker.uid === uid);
        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const marker = addedMarkers[index];
        if (!marker) {
            isRemoving = false;
            return;
        }

        addedMarkers.splice(index, 1);
        isRemoving = false;
    }
}

function handleDrawMarkers() {
    if (isRemoving) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isUnconscious) {
        return;
    }

    for (let i = 0; i < addedMarkers.length; i++) {
        const marker = addedMarkers[i];
        if (!marker.maxDistance) {
            marker.maxDistance = 50;
        }

        if (distance2d(alt.Player.local.pos, marker.pos) > marker.maxDistance) {
            continue;
        }

        if (!marker.scale) {
            marker.scale = new alt.Vector3(1, 1, 1);
        }

        drawMarker(marker.type, marker.pos, marker.scale, marker.color);
    }
}

alt.onServer(SystemEvent.POPULATE_MARKERS, MarkerManager.populate);
alt.onServer(SystemEvent.APPEND_MARKER, MarkerManager.append);
alt.onServer(SystemEvent.REMOVE_MARKER, MarkerManager.remove);
