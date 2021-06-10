import * as alt from 'alt-server';
import { ViewEventsCreator, EconomyTypes, SYSTEM_EVENTS } from '../../../shared/utility/enums';
import { World } from '../../systems/world';
import emit from './emit';
import { DEFAULT_CONFIG } from '../../configs/settings';
import { playerFuncs } from '../player';
import save from './save';

function currencyData(p: alt.Player): void {
    const keys: (keyof typeof EconomyTypes)[] = <(keyof typeof EconomyTypes)[]>Object.keys(EconomyTypes);
    for (const key of keys) {
        const currencyName: string = EconomyTypes[key];
        emit.meta(p, currencyName, p.data[currencyName]);
    }
}

function design(p: alt.Player): void {
    if (p.data.design.sex === 0) p.model = 'mp_f_freemode_01';
    else p.model = 'mp_m_freemode_01';
    p.setSyncedMeta('Name', p.data.name);
    emit.meta(p, 'appearance', p.data.design);
    alt.emitClient(p, ViewEventsCreator.Sync, p.data.design);
}

function inventory(p: alt.Player): void {
    if (!p.data.inventory) {
        p.data.inventory = new Array(6);
        for (let i = 0; i < p.data.inventory.length; i++) {
            p.data.inventory[i] = [];
        }
    }
    if (!p.data.toolbar) p.data.toolbar = [];
    if (!p.data.equipment) p.data.equipment = [];
    emit.meta(p, 'inventory', p.data.inventory);
    emit.meta(p, 'equipment', p.data.equipment);
    emit.meta(p, 'toolbar', p.data.toolbar);
}

function syncedMeta(p: alt.Player): void {
    p.setSyncedMeta('ping', p.ping);
    p.setSyncedMeta('position', p.pos);
}

function time(p: alt.Player): void {
    alt.emitClient(p, SYSTEM_EVENTS.WORLD_UPDATE_TIME, World.hour, World.minute);
}

function weather(p: alt.Player): void {
    p.gridSpace = World.getGridSpace(p);
    p.currentWeather = World.getWeatherByGrid(p.gridSpace);
    emit.meta(p, 'gridSpace', p.gridSpace);
    alt.emitClient(p, SYSTEM_EVENTS.WORLD_UPDATE_WEATHER, p.currentWeather);
}

function playTime(p: alt.Player): void {
    if (!p.data.hours) p.data.hours = 0;
    p.data.hours += 0.0166666666666667;
    save.field(p, 'hours', p.data.hours);
}

function food(p: alt.Player): void {
    if (p.data.isUnconscious && p.data.hunger >= 100) {
        p.data.hunger = 0;
        emit.meta(p, 'hunger', p.data.hunger);
        return;
    }
    playerFuncs.safe.addFood(p, DEFAULT_CONFIG.FOOD_REMOVAL_RATE);
}

function water(p: alt.Player): void {
    if (p.data.isUnconscious && p.data.thirst >= 100) {
        p.data.thirst = 0;
        emit.meta(p, 'thirst', p.data.thirst);
        return;
    }
    playerFuncs.safe.addWater(p, DEFAULT_CONFIG.FOOD_REMOVAL_RATE);
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
    currencyData,
    food,
    inventory,
    playTime,
    syncedMeta,
    time,
    vehicles,
    water,
    weather
};
