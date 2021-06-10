/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../../shared/utility/enums';
import { Character } from '../../../shared/interfaces/character';
import { DEFAULT_CONFIG } from '../../tlrp/config';
import emit from './emit';
import safe from './safe';
import setter from './setter';
import save from './save';
import sync from './sync';
import { EVENTS_PLAYER } from '../../enums';

async function selectCharacter(player: alt.Player, characterData: Partial<Character>): Promise<void> {
    player.data = { ...characterData };
    sync.design(player);
    alt.emitClient(player, SYSTEM_EVENTS.TICKS_START);
    player.dimension = 0;
    setter.frozen(player, true);
    alt.setTimeout(() => {
        if (player.data.pos) safe.setPosition(player, player.data.pos.x, player.data.pos.y, player.data.pos.z);
        else safe.setPosition(player, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.x, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.y, DEFAULT_CONFIG.PLAYER_NEW_SPAWN_POS.z);
        if (player.data.exterior) {
            safe.setPosition(player, player.data.exterior.x, player.data.exterior.y, player.data.exterior.z);
            player.data.exterior = null;
            save.field(player, 'exterior', player.data.exterior);
        }
        if (player.data.blood) safe.addBlood(player, player.data.blood);
        else safe.addBlood(player, 7500);
        if (player.data.armour) safe.addArmour(player, player.data.armour, true);
        else safe.addArmour(player, 0, true);
        if (player.data.isUnconscious) {
            player.nextDeathSpawn = Date.now() + 30000;
            player.data.isUnconscious = false;
            safe.addBlood(player, -7500);
            emit.meta(player, 'isUnconscious', true);
        } else {
            player.data.isUnconscious = false;
            emit.meta(player, 'isUnconscious', false);
        }
        // Synchronization
        sync.economy(player);
        sync.weather(player);
        sync.time(player);
        sync.inventory(player);
        sync.water(player);
        sync.food(player);
        sync.mood(player);
        sync.vehicles(player);

        /*InteractionController.populateCustomInteractions(player);
        BlipController.populateGlobalBlips(player);
        MarkerController.populateGlobalMarkers(player);
        TextLabelController.populateGlobalLabels(player);*/
        alt.emit(SYSTEM_EVENTS.VOICE_ADD, player);
        alt.emit(EVENTS_PLAYER.SELECTED_CHARACTER, player);
    }, 500);
    delete player.characters;
}

export default {
    character: selectCharacter
};
