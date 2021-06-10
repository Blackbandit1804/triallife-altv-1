import * as alt from 'alt-server';
import { EVENTS_PLAYER, EVENTS_VEHICLE } from '../enums';
declare type playerCallback = (result: alt.Player, ...args: any) => void;
declare type vehicleCallback = (result: alt.Vehicle, ...args: any) => void;
export declare class EventController {
    static onPlayer(eventName: EVENTS_PLAYER, callback: playerCallback): void;
    static onVehicle(eventName: EVENTS_VEHICLE, callback: vehicleCallback): void;
}
export {};
