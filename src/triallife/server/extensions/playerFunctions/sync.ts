import * as alt from 'alt-server';
import { ViewCreator } from '../../../shared/enums/views';
import { EconomyType } from '../../../shared/enums/economyTypes';
import { World } from '../../system/world';
import { SystemEvent } from '../../../shared/enums/system';
import emit from './emit';
import { DefaultConfig } from '../../configs/settings';
import { playerFuncs } from '../player';
import save from './save';

function economyData(p: alt.Player): void {
    const keys: (keyof typeof EconomyType)[] = <(keyof typeof EconomyType)[]>Object.keys(EconomyType);
    for (const key of keys) {
        const economyName: string = EconomyType[key];
        emit.meta(p, economyName, p.data[economyName]);
    }
}

function design(p: alt.Player): void {
    if (p.data.design.sex === 0) {
        p.model = 'mp_f_freemode_01';
    } else {
        p.model = 'mp_m_freemode_01';
    }
    p.setSyncedMeta('Name', p.data.name);
    emit.meta(p, 'design', p.data.design);
    alt.emitClient(p, ViewCreator.Sync, p.data.design);
}

function inventory(p: alt.Player): void {
    if (!p.data.inventory) {
        p.data.inventory = new Array(6);
        for (let i = 0; i < p.data.inventory.length; i++) {
            p.data.inventory[i] = [];
        }
    }

    if (!p.data.toolbar) {
        p.data.toolbar = [];
    }

    if (!p.data.equipment) {
        p.data.equipment = [];
    }

    emit.meta(p, 'inventory', p.data.inventory);
    emit.meta(p, 'equipment', p.data.equipment);
    emit.meta(p, 'toolbar', p.data.toolbar);
}

function syncedMeta(p: alt.Player): void {
    p.setSyncedMeta('Ping', p.ping);
    p.setSyncedMeta('Position', p.pos);
}

function time(p: alt.Player): void {
    alt.emitClient(p, SystemEvent.WORLD_UPDATE_TIME, World.hour, World.minute);
}

function weather(p: alt.Player): void {
    p.gridSpace = World.getGridSpace(p);
    p.currentWeather = World.getWeatherByGrid(p.gridSpace);
    emit.meta(p, 'gridSpace', p.gridSpace);
    alt.emitClient(p, SystemEvent.WORLD_UPDATE_WEATHER, p.currentWeather);
}

function playTime(p: alt.Player): void {
    if (!p.data.hours) {
        p.data.hours = 0;
    }

    p.data.hours += 0.0166666666666667;
    save.field(p, 'hours', p.data.hours);
}

function food(p: alt.Player): void {
    if (p.data.isUnconscious && p.data.hunger <= 0) {
        p.data.hunger = 100;
        emit.meta(p, 'hunger', p.data.hunger);
        return;
    }

    playerFuncs.safe.addFood(p, -DefaultConfig.FOOD_REMOVAL_RATE);
}

function water(p: alt.Player): void {
    if (p.data.isUnconscious && p.data.thirst <= 0) {
        p.data.thirst = 100;
        emit.meta(p, 'thirst', p.data.thirst);
        return;
    }
    playerFuncs.safe.addWater(p, -DefaultConfig.FOOD_REMOVAL_RATE);
}

function mood(p: alt.Player): void {
    if (p.data.isUnconscious && p.data.mood <= 0) {
        p.data.mood = 100;
        emit.meta(p, 'mood', p.data.mood);
        return;
    }
    playerFuncs.safe.addWater(p, -DefaultConfig.FOOD_REMOVAL_RATE);
}

function vehicles(p: alt.Player): void {
    if (!p.data.vehicles) {
        emit.meta(p, 'vehicles', []);
        return;
    }

    emit.meta(p, 'vehicles', p.data.vehicles);
}

export default {
    design,
    economyData,
    food,
    inventory,
    playTime,
    syncedMeta,
    time,
    vehicles,
    water,
    mood,
    weather
};
