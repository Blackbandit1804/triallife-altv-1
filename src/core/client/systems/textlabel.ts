import * as alt from 'alt-client';
import { SystemEvent } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/text-label';
import { distance2d } from '../../shared/utility/vector';
import { drawText3D } from '../utility/text';

let addedLabels: Array<TextLabel> = [];
let interval;
let isRemoving = false;

export class TextlabelManager {
    /**
     * Add a single text label.
     * @static
     * @param {TextLabel} label
     * @memberof MarkerManager
     */
    static append(label: TextLabel) {
        if (!label.uid) {
            alt.logError(`(${JSON.stringify(label.data)}) Label is missing uid.`);
            return;
        }

        addedLabels.push(label);

        if (!interval) {
            interval = alt.setInterval(handleDrawTextlabels, 0);
        }
    }

    /**
     * Used to populate server-side markers.
     * @static
     * @param {Array<Marker>} markers
     * @memberof MarkerManager
     */
    static populate(markers: Array<TextLabel>) {
        addedLabels = addedLabels.concat(markers);

        if (!interval) {
            interval = alt.setInterval(handleDrawTextlabels, 0);
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

        const index = addedLabels.findIndex((marker) => marker.uid === uid);
        if (index <= -1) {
            isRemoving = false;
            return;
        }

        const label = addedLabels[index];
        if (!label) {
            isRemoving = false;
            return;
        }

        addedLabels.splice(index, 1);
        isRemoving = false;
    }
}

function handleDrawTextlabels() {
    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isUnconscious) {
        return;
    }

    for (let i = 0; i < addedLabels.length; i++) {
        const label = addedLabels[i];
        if (!label.maxDistance) {
            label.maxDistance = 15;
        }

        if (distance2d(alt.Player.local.pos, label.pos) > label.maxDistance) {
            continue;
        }

        drawText3D(label.data, label.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

alt.onServer(SystemEvent.APPEND_TEXTLABELS, TextlabelManager.append);
alt.onServer(SystemEvent.POPULATE_TEXTLABELS, TextlabelManager.populate);
alt.onServer(SystemEvent.REMOVE_TEXTLABEL, TextlabelManager.remove);
