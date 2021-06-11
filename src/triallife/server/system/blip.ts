import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/Blip';
import { DefaultConfig } from '../configs/settings';
import Logger from '../utility/tlrpLogger';
import { sha256Random } from '../utility/encryption';

const globalBlips: Array<Blip> = [];

export class BlipController {
    static add(blip: Blip) {
        globalBlips.push(blip);
    }

    static append(blip: Blip) {
        if (!blip.uid) {
            Logger.error(`(${JSON.stringify(blip.pos)}) Blip does not have a unique id (uid).`);
            return;
        }
        BlipController.add(blip);
        alt.emit(null, SystemEvent.APPEND_BLIP, blip);
    }

    static remove(uid: string): boolean {
        const index = globalBlips.findIndex((label) => label.uid === uid);
        if (index <= -1) return false;
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
    BlipController.append({
        text: 'Krankenhaus',
        color: 6,
        sprite: 153,
        scale: 1,
        shortRange: true,
        pos: position,
        uid: hash
    });
});
