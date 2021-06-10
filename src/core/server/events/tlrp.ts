/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { EVENTS_PLAYER, EVENTS_VEHICLE } from '../enums';

const events: { [key: string]: Array<any> } = {};

type playerCallback = (result: alt.Player, ...args: any) => void;
type vehicleCallback = (result: alt.Vehicle, ...args: any) => void;

function on(eventName: EVENTS_PLAYER | EVENTS_VEHICLE, callback: playerCallback | vehicleCallback) {
    if (!events[eventName]) events[eventName] = [];
    events[eventName].push(callback);
}

export class EventController {
    static onPlayer(eventName: EVENTS_PLAYER, callback: playerCallback) {
        on(eventName, callback);
    }
    static onVehicle(eventName: EVENTS_VEHICLE, callback: vehicleCallback) {
        on(eventName, callback);
    }
}

function processCallbacks(eventName: string, args: any[]) {
    if (!events[eventName]) return;
    events[eventName].forEach((callback: Function) => callback(...args));
}

Object.values(EVENTS_PLAYER).forEach((eventName) => alt.on(eventName, (...args: any[]) => processCallbacks(eventName.toString(), args)));
Object.values(EVENTS_VEHICLE).forEach((eventName) => alt.on(eventName, (...args: any[]) => processCallbacks(eventName.toString(), args)));
