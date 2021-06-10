import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/utility/enums';
import { DEFAULT_CONFIG } from '../tlrp/config';
import Logger from '../utility/tlrpLogger';
import { sha256Random } from '../utility/encryption';
const globalBlips = [];
export class BlipController {
    static add(blip) {
        globalBlips.push(blip);
    }
    static append(blip) {
        if (!blip.uid) {
            Logger.error(`(${JSON.stringify(blip.pos)}) Blip does not have a unique id (uid).`);
            return;
        }
        BlipController.add(blip);
        alt.emit(null, SYSTEM_EVENTS.APPEND_BLIP, blip);
    }
    static remove(uid) {
        const index = globalBlips.findIndex((label) => label.uid === uid);
        if (index <= -1)
            return false;
        alt.emit(null, SYSTEM_EVENTS.REMOVE_BLIP, uid);
        globalBlips.splice(index, 1);
        return true;
    }
    static populateGlobalBlips(player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_BLIPS, globalBlips);
    }
}
DEFAULT_CONFIG.VALID_HOSPITALS.forEach((position) => {
    const hash = sha256Random(JSON.stringify(position));
    BlipController.append({ text: 'Krankenhaus', color: 6, sprite: 153, scale: 1, shortRange: true, pos: position, uid: hash });
});
