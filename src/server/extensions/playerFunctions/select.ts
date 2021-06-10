import * as alt from 'alt-server';
import { EVENTS_PLAYER } from '../../utility/enums';
import { SYSTEM_EVENTS } from '../../../shared/utility/enums';
import { Character } from '../../../shared/interfaces/Character';
import { DEFAULT_CONFIG } from '../../configs/settings';
import { BlipController } from '../../systems/blip';
import { InteractionController } from '../../systems/interaction';
import { MarkerController } from '../../systems/marker';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import sync from './sync';
import { TextLabelController } from '../../systems/textlabel';
import save from './save';

async function selectCharacter(p: alt.Player, characterData: Partial<Character>): Promise<void> {
    p.data = { ...characterData };
    sync.appearance(p);
    alt.emitClient(p, SYSTEM_EVENTS.TICKS_START);
    p.dimension = 0;
    setter.frozen(p, true);
    alt.setTimeout(() => {
        if (p.data.pos) safe.setPosition(p, p.data.pos.x, p.data.pos.y, p.data.pos.z);
        else safe.setPosition(p, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z);
        if (p.data.exterior) {
            safe.setPosition(p, p.data.exterior.x, p.data.exterior.y, p.data.exterior.z);
            p.data.exterior = null;
            save.field(p, 'exterior', p.data.exterior);
        }
        if (p.data.blood) safe.addBlood(p, p.data.blood);
        else safe.addBlood(p, 7500);
        if (p.data.armour) safe.addArmour(p, p.data.armour, true);
        else safe.addArmour(p, 0, true);
        if (p.data.isUnconscious) {
            p.nextDeathSpawn = Date.now() + 30000;
            p.data.isUnconscious = false;
            safe.addBlood(p, -7500);
            emit.meta(p, 'isUnconscious', true);
        } else {
            safe.addBlood(p, 3500 - p.data.blood);
            p.data.isUnconscious = false;
            emit.meta(p, 'isUnconscious', false);
        }

        sync.currencyData(p);
        sync.weather(p);
        sync.time(p);
        sync.inventory(p);
        sync.water(p);
        sync.food(p);
        sync.vehicles(p);

        InteractionController.populateCustomInteractions(p);
        BlipController.populateGlobalBlips(p);
        MarkerController.populateGlobalMarkers(p);
        TextLabelController.populateGlobalLabels(p);
        alt.emit(SYSTEM_EVENTS.VOICE_ADD, p);
        alt.emit(EVENTS_PLAYER.SELECTED_CHARACTER, p);
    }, 500);
    delete p.characters;
}

export default {
    character: selectCharacter
};
