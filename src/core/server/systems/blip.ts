import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/blip';
import { DefaultConfig } from '../configs/settings';
import Logger from '../utility/tlrp-logger';
import { sha256Random } from '../utility/encryption';

const globalBlips: Array<Blip> = [];

export class BlipManager {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {Blip} blip
     * @memberof BlipManager
     */
    static add(blip: Blip) {
        globalBlips.push(blip);
    }

    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {Blip} label
     * @memberof BlipManager
     */
    static append(blip: Blip) {
        if (!blip.uid) {
            Logger.error(`(${JSON.stringify(blip.pos)}) Blip does not have a unique id (uid).`);
            return;
        }

        BlipManager.add(blip);
        alt.emit(null, SystemEvent.APPEND_BLIP, blip);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelManager
     */
    static remove(uid: string): boolean {
        const index = globalBlips.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emit(null, SystemEvent.REMOVE_BLIP, uid);
        globalBlips.splice(index, 1);
        return true;
    }

    static populateGlobalBlips(player: alt.Player) {
        alt.emitClient(player, SystemEvent.POPULATE_BLIPS, globalBlips);
    }
}

DefaultConfig.VALID_HOSPITALS.forEach((position) => {
    const hash = sha256Random(JSON.stringify(position));
    BlipManager.append({
        text: 'Hospital',
        color: 6,
        sprite: 153,
        scale: 1,
        shortRange: true,
        pos: position,
        uid: hash
    });
});
