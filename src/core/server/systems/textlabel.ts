import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/text-label';
import Logger from '../utility/tlrp-logger';

const globalTextLabels: Array<TextLabel> = [];

export class TextLabelManager {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {TextLabel} label
     * @memberof TextLabelManager
     */
    static add(label: TextLabel) {
        globalTextLabels.push(label);
    }

    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {TextLabel} label
     * @memberof TextLabelManager
     */
    static append(label: TextLabel) {
        if (!label.uid) {
            Logger.error(`(${label.data}) Label does not have a unique id (uid).`);
            return;
        }

        TextLabelManager.add(label);
        alt.emit(null, SystemEvent.APPEND_TEXTLABELS, label);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelManager
     */
    static remove(uid: string): boolean {
        const index = globalTextLabels.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emit(null, SystemEvent.REMOVE_TEXTLABEL, uid);
        globalTextLabels.splice(index, 1);
        return true;
    }

    /**
     * Creates all existing labels for a player.
     * @static
     * @param {alt.Player} player
     * @memberof TextLabelManager
     */
    static populateGlobalLabels(player: alt.Player) {
        alt.emitClient(player, SystemEvent.POPULATE_TEXTLABELS, globalTextLabels);
    }
}
