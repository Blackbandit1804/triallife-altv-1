import * as alt from 'alt-server';
import { playerAttachVirtualBound } from 'natives';
import { Character } from '../../../shared/interfaces/character';
import { SystemEvent } from '../../../shared/utility/enums';
import { DefaultConfig } from '../../configs/settings';
import { BlipManager } from '../../systems/blip';
import { TlrpEvent } from '../../utility/enums';
import { getUniquePlayerHash } from '../../utility/usefull';

import emit from './emit';
import save from './save';
import setter from './setter';
import sync from './synchronize';

async function character(p: alt.Player, characterData: Partial<Character>): Promise<void> {
    p.data = { ...characterData };
    sync.design(p);
    alt.emitClient(p, SystemEvent.Ticks_Start);
    p.dimension = 0;
    setter.frozen(p, true);
    alt.setTimeout(() => {
        if (p.data.pos) save.setPosition(p, p.data.pos.x, p.data.pos.y, p.data.pos.z);
        else save.setPosition(p, DefaultConfig.PLAYER_CREATE_SPAWN_POS.x, DefaultConfig.PLAYER_CREATE_SPAWN_POS.y, DefaultConfig.PLAYER_CREATE_SPAWN_POS.z);

        if (p.data.exterior) {
            save.setPosition(p, p.data.exterior.x, p.data.exterior.y, p.data.exterior.z);
            p.data.exterior = null;
            save.field(p, 'exterior', p.data.exterior);
        }

        if (p.data.stats) save.setStats(p, p.data.stats);

        if (p.data.stats.blood) save.addHealth(p, p.data.stats.blood, true);
        else save.addHealth(p, 7500, true);

        if (p.data.stats.armour) save.addArmour(p, p.data.stats.armour, true);
        else save.addArmour(p, 0, true);

        if (p.data.isUnconsciouse) {
            p.nextUnconsciouseSpawn = Date.now() + 180000;
            p.data.isUnconsciouse = false;
            save.addHealth(p, 2500, true);
            emit.meta(p, 'isUnconsciouse', true);
        } else {
            p.data.isUnconsciouse = false;
            emit.meta(p, 'isUnconsciouse', false);
        }

        sync.weather(p);
        sync.time(p);
        sync.inventory(p);
        sync.hunger(p);
        sync.thirst(p);
        sync.mood(p);
        sync.vehicles(p);
        setter.frozen(p, false);

        BlipManager.populateGlobalBlips(p);

        alt.emit(SystemEvent.Voice_Add, p);
        alt.emit(TlrpEvent.PLAYER_SELECTED_CHARACTER, p);
    }, 500);
    delete p.characters;
}

export default { character };
