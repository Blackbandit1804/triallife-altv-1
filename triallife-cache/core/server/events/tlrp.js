import * as alt from 'alt-server';
import { EVENTS_PLAYER, EVENTS_VEHICLE } from '../enums';
const events = {};
function on(eventName, callback) {
    if (!events[eventName])
        events[eventName] = [];
    events[eventName].push(callback);
}
export class EventController {
    static onPlayer(eventName, callback) {
        on(eventName, callback);
    }
    static onVehicle(eventName, callback) {
        on(eventName, callback);
    }
}
function processCallbacks(eventName, args) {
    if (!events[eventName])
        return;
    events[eventName].forEach((callback) => callback(...args));
}
Object.values(EVENTS_PLAYER).forEach((eventName) => alt.on(eventName, (...args) => processCallbacks(eventName.toString(), args)));
Object.values(EVENTS_VEHICLE).forEach((eventName) => alt.on(eventName, (...args) => processCallbacks(eventName.toString(), args)));
