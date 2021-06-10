import * as alt from 'alt-server';
import { Vehicle_Behavior, Vehicle_Lock_State, Vehicle_Lock_States, Vehicle_State } from '../../../shared/utility/enums';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { EVENTS_VEHICLE } from '../../enums';
import { playerFuncs } from '../Player';
import getter from './getter';
import keys from './keys';
import setter from './setter';

function lock(vehicle: alt.Vehicle, player: alt.Player, bypass: boolean = false): Vehicle_Lock_State {
    if (!bypass) if (!getter.isOwner(vehicle, player) && !keys.has(vehicle, player)) return vehicle.lockStatus;
    if (vehicle.lockStatus === null || vehicle.lockStatus === undefined) {
        vehicle.lockStatus = Vehicle_Lock_State.UNLOCKED;
        for (let i = 0; i < 6; i++) setter.doorOpen(vehicle, player, i, false);
        vehicle.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, vehicle.lockStatus);
        return vehicle.lockStatus;
    }
    let index = Vehicle_Lock_States.findIndex((x) => x === vehicle.lockStatus);
    if (index + 1 === Vehicle_Lock_States.length) index = -1;
    vehicle.lockStatus = Vehicle_Lock_States[index + 1];
    vehicle.setStreamSyncedMeta(Vehicle_State.LOCK_STATE, vehicle.lockStatus);
    if (vehicle.lockStatus === Vehicle_Lock_State.LOCKED) for (let i = 0; i < 6; i++) setter.doorOpen(vehicle, player, i, false);
    alt.emit(EVENTS_VEHICLE.LOCK_STATE_CHANGE, vehicle);
    return vehicle.lockStatus;
}

function engine(vehicle: alt.Vehicle, player: alt.Player, bypass: boolean = false): void {
    if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NEED_KEY_TO_START) && !bypass) if (!getter.isOwner(vehicle, player) && !keys.has(vehicle, player)) return;
    if (!getter.hasFuel(vehicle)) {
        vehicle.engineStatus = false;
        vehicle.setStreamSyncedMeta(Vehicle_State.ENGINE, vehicle.engineStatus);
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_FUEL));
        return;
    }
    vehicle.engineStatus = !vehicle.engineStatus;
    vehicle.setStreamSyncedMeta(Vehicle_State.ENGINE, vehicle.engineStatus);
    if (player) {
        const status = vehicle.engineStatus ? LocaleController.get(LOCALE_KEYS.LABEL_ON) : LocaleController.get(LOCALE_KEYS.LABEL_OFF);
        const fullMessage = `${LocaleController.get(LOCALE_KEYS.LABEL_ENGINE)} ~y~ ${status}`;
        playerFuncs.emit.notification(player, fullMessage);
    }
    alt.emit(EVENTS_VEHICLE.ENGINE_STATE_CHANGE, vehicle);
}

export default {
    engine,
    lock
};
