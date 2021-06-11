import * as alt from 'alt-server';
import { TlrpPlayerEvent } from '../../enums/tlrp';
import { SystemEvent } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/character';
import { DefaultConfig } from '../../configs/settings';
import { BlipController } from '../../system/blip';
import { InteractionController } from '../../system/interaction';
import { MarkerController } from '../../system/marker';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import sync from './sync';
import { TextLabelController } from '../../system/textlabel';
import save from './save';

async function selectCharacter(p: alt.Player, characterData: Partial<Character>): Promise<void> {
    p.data = { ...characterData };
    sync.design(p);
    alt.emitClient(p, SystemEvent.TICKS_START);

    // Set player dimension to zero.
    p.dimension = 0;
    setter.frozen(p, true);

    alt.setTimeout(() => {
        if (p.data.pos) {
            safe.setPosition(p, p.data.pos.x, p.data.pos.y, p.data.pos.z);
        } else {
            safe.setPosition(
                p,
                DefaultConfig.PLAYER_NEW_SPAWN_POS.x,
                DefaultConfig.PLAYER_NEW_SPAWN_POS.y,
                DefaultConfig.PLAYER_NEW_SPAWN_POS.z
            );
        }

        // Save immediately after using exterior login.
        if (p.data.exterior) {
            safe.setPosition(p, p.data.exterior.x, p.data.exterior.y, p.data.exterior.z);
            p.data.exterior = null;
            save.field(p, 'exterior', p.data.exterior);
        }

        // Check if health exists.
        if (p.data.blood) {
            safe.addBlood(p, p.data.blood, true);
        } else {
            safe.addBlood(p, 7500, true);
        }

        // Check if armour exists.
        if (p.data.armour) {
            safe.addArmour(p, p.data.armour, true);
        } else {
            safe.addArmour(p, 0, true);
        }

        // Resets their death status and logs them in as dead.
        if (p.data.isUnconscious) {
            p.nextDeathSpawn = Date.now() + 30000;
            p.data.isUnconscious = false;
            safe.addBlood(p, 0, true);
            emit.meta(p, 'isUnconscious', true);
        } else {
            p.data.isUnconscious = false;
            emit.meta(p, 'isUnconscious', false);
        }

        // Synchronization
        sync.economyData(p);
        sync.weather(p);
        sync.time(p);
        sync.inventory(p);
        sync.water(p);
        sync.food(p);
        sync.vehicles(p);

        // Propagation
        InteractionController.populateCustomInteractions(p);
        BlipController.populateGlobalBlips(p);
        MarkerController.populateGlobalMarkers(p);
        TextLabelController.populateGlobalLabels(p);
        alt.emit(SystemEvent.VOICE_ADD, p);
        alt.emit(TlrpPlayerEvent.SELECTED_CHARACTER, p);
    }, 500);

    // Delete unused data from the Player.
    delete p.currentCharacters;
}

export default {
    character: selectCharacter
};
