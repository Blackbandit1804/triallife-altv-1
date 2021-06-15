import * as alt from 'alt-server';
import { TLRP_EVENTS_PLAYER } from '../../enums/tlrp';
import { SystemEvent } from '../../../shared/enums/system';
import { Character } from '../../../shared/interfaces/character';
import { DefaultConfig } from '../../configs/settings';
import { BlipManager } from '../../systems/blip';
import ChatManager from '../../systems/chat';
import { InteractionManager } from '../../systems/interaction';
import { MarkerManager } from '../../systems/marker';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import sync from './sync';
import { TextLabelManager } from '../../systems/textlabel';
import save from './save';

/**
 * Select a character based on the character data provided.
 * @param {Partial<Character>} characterData
 * @return {*}  {Promise<void>}
 * @memberof SelectPrototype
 */
async function selectCharacter(p: alt.Player, characterData: Partial<Character>): Promise<void> {
    p.data = { ...characterData };
    sync.appearance(p);
    alt.emitClient(p, SystemEvent.TICKS_START);

    // Set player dimension to zero.
    p.dimension = 0;
    setter.frozen(p, true);

    alt.setTimeout(() => {
        if (p.data.pos) {
            safe.setPosition(p, p.data.pos.x, p.data.pos.y, p.data.pos.z);
        } else {
            safe.setPosition(p, DefaultConfig.PLAYER_NEW_SPAWN_POS.x, DefaultConfig.PLAYER_NEW_SPAWN_POS.y, DefaultConfig.PLAYER_NEW_SPAWN_POS.z);
        }

        // Save immediately after using exterior login.
        if (p.data.exterior) {
            safe.setPosition(p, p.data.exterior.x, p.data.exterior.y, p.data.exterior.z);
            p.data.exterior = null;
            save.field(p, 'exterior', p.data.exterior);
        }

        // Check if health exists.
        if (p.data.health) {
            safe.addHealth(p, p.data.health, true);
        } else {
            safe.addHealth(p, 200, true);
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
            safe.addHealth(p, 0, true);
            emit.meta(p, 'isDead', true);
        } else {
            p.data.isUnconscious = false;
            emit.meta(p, 'isDead', false);
        }

        // Synchronization
        sync.currencyData(p);
        sync.weather(p);
        sync.time(p);
        sync.inventory(p);
        sync.water(p);
        sync.food(p);
        sync.vehicles(p);

        // Propagation
        ChatManager.populateCommands(p);
        InteractionManager.populateCustomInteractions(p);
        BlipManager.populateGlobalBlips(p);
        MarkerManager.populateGlobalMarkers(p);
        TextLabelManager.populateGlobalLabels(p);
        alt.emit(SystemEvent.VOICE_ADD, p);
        alt.emit(TLRP_EVENTS_PLAYER.SELECTED_CHARACTER, p);
    }, 500);

    // Delete unused data from the Player.
    delete p.currentCharacters;
}

export default {
    character: selectCharacter
};
