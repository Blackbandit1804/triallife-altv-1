/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { EconomyTypes, View_Events_Creator, SYSTEM_EVENTS } from '../../../shared/utility/enums';
import { DEFAULT_CONFIG } from '../../tlrp/config';
import { playerFuncs } from '../player';
import { World } from '../../systems/world';
import save from './save';
import emit from './emit';

function economy(player: alt.Player): void {
    const keys: (keyof typeof EconomyTypes)[] = <(keyof typeof EconomyTypes)[]>Object.keys(EconomyTypes);
    for (const key of keys) {
        const economyName: string = EconomyTypes[key];
        emit.meta(player, economyName, player.data[economyName]);
    }
}

function design(player: alt.Player): void {
    if (player.data.design.sex === 0) player.model = 'mp_f_freemode_01';
    else player.model = 'mp_m_freemode_01';
    player.setSyncedMeta('Name', player.data.name);
    emit.meta(player, 'design', player.data.design);
    alt.emitClient(player, View_Events_Creator.Sync, player.data.design);
}

function inventory(player: alt.Player): void {
    if (!player.data.inventory) {
        player.data.inventory = new Array(6);
        for (let i = 0; i < player.data.inventory.length; i++) player.data.inventory[i] = [];
    }
    if (!player.data.toolbar) player.data.toolbar = [];
    if (!player.data.equipment) player.data.equipment = [];
    emit.meta(player, 'inventory', player.data.inventory);
    emit.meta(player, 'equipment', player.data.equipment);
    emit.meta(player, 'toolbar', player.data.toolbar);
}

function syncedMeta(player: alt.Player): void {
    player.setSyncedMeta('ping', player.ping);
    player.setSyncedMeta('position', player.pos);
}

function time(player: alt.Player): void {
    alt.emitClient(player, SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.hour, World.minute);
}

function weather(player: alt.Player): void {
    player.gridSpace = World.getGridSpace(player);
    player.currentWeather = World.getWeatherByGrid(player.gridSpace);
    alt.emitClient(player, SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, player.currentWeather);
}

function playTime(player: alt.Player): void {
    if (!player.data.hours) player.data.hours = 0;
    player.data.hours += 0.0166666666666667;
    save.field(player, 'hours', player.data.hours);
}

function food(player: alt.Player): void {
    if (player.data.isUnconscious && player.data.hunger >= 100) {
        player.data.hunger = 0;
        emit.meta(player, 'hunger', player.data.hunger);
        return;
    }
    playerFuncs.safe.addFood(player, DEFAULT_CONFIG.FOOD_REMOVAL_RATE);
}

function water(player: alt.Player): void {
    if (player.data.isUnconscious && player.data.thirst >= 100) {
        player.data.thirst = 0;
        emit.meta(player, 'thirst', player.data.thirst);
        return;
    }
    playerFuncs.safe.addWater(player, DEFAULT_CONFIG.FOOD_REMOVAL_RATE);
}

function mood(player: alt.Player): void {
    if (player.data.isUnconscious && player.data.mood >= 100) {
        player.data.mood = 0;
        emit.meta(player, 'mood', player.data.mood);
        return;
    }
    playerFuncs.safe.addMood(player, DEFAULT_CONFIG.MOOD_REMOVAL_RATE);
}

function vehicles(player: alt.Player): void {
    if (!player.data.vehicles) {
        emit.meta(player, 'vehicles', []);
        return;
    }
    emit.meta(player, 'vehicles', player.data.vehicles);
}

export default {
    design,
    economy,
    inventory,
    playTime,
    syncedMeta,
    time,
    vehicles,
    food,
    water,
    mood,
    weather
};
