import * as alt from 'alt-server';
import { Item } from '../../../shared/interfaces/item';
import { SystemEvent, ViewEvent } from '../../../shared/utility/enums';
import { DefaultConfig } from '../../configs/settings';
import { World } from '../../systems/world';
import { playerFuncs } from '../player';
import emit from './emit';
import save from './save';

function design(p: alt.Player): void {
    if (p.data.design.sex === 0) p.model = 'mp_f_freemode_01';
    else p.model = 'mp_m_freemode_01';
    p.setSyncedMeta('Name', p.data.info.name);
    emit.meta(p, 'design', p.data.design);
    alt.emitClient(p, ViewEvent.CharEditor_Sync, p.data.design);
}

function inventory(p: alt.Player): void {
    if (!p.data.inventory) p.data.inventory = { maxWeight: 15.0, money: 500.0, items: new Array<Partial<Item>>() };
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
    alt.emitClient(p, SystemEvent.Time_Update, World.hour, World.minute);
}

function weather(p: alt.Player): void {
    p.gridSpace = World.getGridSpace(p);
    p.curWeather = World.getWeatherByGrid(p.gridSpace);
    emit.meta(p, 'gridSpace', p.gridSpace);
    alt.emitClient(p, SystemEvent.Weather_Update, p.curWeather);
}

function playTime(p: alt.Player): void {
    if (!p.data.hours) p.data.hours = 0;
    p.data.hours += 0.0166666666666667;
    save.field(p, 'hours', p.data.hours);
}

function hunger(p: alt.Player): void {
    if (p.data.isUnconsciouse && p.data.stats.hunger <= 0) {
        p.data.stats.hunger = 100;
        emit.meta(p, 'hunger', p.data.stats.hunger);
        return;
    }
    playerFuncs.save.addHunger(p, -DefaultConfig.HUNGER_REMOVEL_RATE);
}

function thirst(p: alt.Player): void {
    if (p.data.isUnconsciouse && p.data.stats.thirst <= 0) {
        p.data.stats.thirst = 100;
        emit.meta(p, 'thirst', p.data.stats.thirst);
        return;
    }
    playerFuncs.save.addThirst(p, -DefaultConfig.THIRST_REMOVAL_RATE);
}

function mood(p: alt.Player): void {
    if (p.data.isUnconsciouse && p.data.stats.mood <= 0) {
        p.data.stats.mood = 100;
        emit.meta(p, 'mood', p.data.stats.mood);
        return;
    }
    playerFuncs.save.addMood(p, -DefaultConfig.MOOD_REMOVAL_RATE);
}

function vehicles(p: alt.Player): void {
    if (!p.data.vehicles) {
        emit.meta(p, 'vehicles', []);
        return;
    }
    emit.meta(p, 'vehicles', p.data.vehicles);
}

export default { design, hunger, inventory, playTime, syncedMeta, time, vehicles, thirst, mood, weather };
