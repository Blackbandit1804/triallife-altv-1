import * as alt from 'alt-server';
import { Blip } from '../../shared/interfaces/blip';
import { SystemEvent } from '../../shared/utility/enums';
import { DefaultConfig } from '../configs/settings';
import Logger from '../utility/Logger';
import { sha256Random } from '../utility/usefull';

const globalBlips: Array<Blip> = [];

export class BlipManager {
    static add(blip: Blip) {
        globalBlips.push(blip);
    }

    static append(blip: Blip) {
        if (!blip.uid) {
            Logger.error(`(${JSON.stringify(blip.pos)}) Blip does not have a unique id (uid).`);
            return;
        }
        BlipManager.add(blip);
        alt.emit(null, SystemEvent.Blip_Append, blip);
    }

    static remove(uid: string): boolean {
        const index = globalBlips.findIndex((label) => label.uid === uid);
        if (index <= -1) return false;
        alt.emit(null, SystemEvent.Blip_Remove, uid);
        globalBlips.splice(index, 1);
        return true;
    }

    static populateGlobalBlips(player: alt.Player) {
        alt.emitClient(player, SystemEvent.Blip_Populate, globalBlips);
    }
}

DefaultConfig.HOSPITAL_SPAWNS.forEach((position) => {
    const hash = sha256Random(JSON.stringify(position));
    BlipManager.append({ text: 'Krankenhaus', color: 6, sprite: 153, scale: 1, shortRange: true, pos: position, uid: hash });
});
