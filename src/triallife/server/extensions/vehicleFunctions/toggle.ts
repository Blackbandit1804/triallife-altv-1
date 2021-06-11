import * as alt from 'alt-server';
import { Behavior, LockState, LockStates, VehicleDoorState } from '../../../shared/enums/vehicle';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { TlrpVehicleEvent } from '../../enums/tlrp';
import { playerFuncs } from '../player';
import getter from './getter';
import keys from './keys';
import setter from './setter';

function lock(vehicle: alt.Vehicle, player: alt.Player, bypass: boolean = false): LockState {
    if (!bypass) {
        if (!getter.isOwner(vehicle, player) && !keys.has(vehicle, player)) {
            return vehicle.lockStatus;
        }
    }

    if (vehicle.lockStatus === null || vehicle.lockStatus === undefined) {
        vehicle.lockStatus = LockState.UNLOCKED;

        for (let i = 0; i < 6; i++) {
            setter.doorOpen(vehicle, player, i, false);
        }

        vehicle.setStreamSyncedMeta(VehicleDoorState.LOCK_STATE, vehicle.lockStatus);
        return vehicle.lockStatus;
    }

    let index = LockStates.findIndex((x) => x === vehicle.lockStatus);
    if (index + 1 === LockStates.length) {
        index = -1;
    }

    vehicle.lockStatus = LockStates[index + 1];
    vehicle.setStreamSyncedMeta(VehicleDoorState.LOCK_STATE, vehicle.lockStatus);

    // Automatically Close All Doors in Locked State
    if (vehicle.lockStatus === LockState.LOCKED) {
        for (let i = 0; i < 6; i++) {
            setter.doorOpen(vehicle, player, i, false);
        }
    }

    alt.emit(TlrpVehicleEvent.LOCK_STATE_CHANGE, vehicle);
    return vehicle.lockStatus;
}

function engine(vehicle: alt.Vehicle, player: alt.Player, bypass: boolean = false): void {
    if (isFlagEnabled(vehicle.behavior, Behavior.NEED_KEY_TO_START) && !bypass) {
        if (!getter.isOwner(vehicle, player) && !keys.has(vehicle, player)) {
            return;
        }
    }

    if (!getter.hasFuel(vehicle)) {
        vehicle.engineStatus = false;
        vehicle.setStreamSyncedMeta(VehicleDoorState.ENGINE, vehicle.engineStatus);
        playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_NO_FUEL));
        return;
    }

    vehicle.engineStatus = !vehicle.engineStatus;
    vehicle.setStreamSyncedMeta(VehicleDoorState.ENGINE, vehicle.engineStatus);

    if (player) {
        const status = vehicle.engineStatus
            ? LocaleController.get(LOCALE_KEYS.LABEL_ON)
            : LocaleController.get(LOCALE_KEYS.LABEL_OFF);

        const fullMessage = `${LocaleController.get(LOCALE_KEYS.LABEL_ENGINE)} ~y~ ${status}`;
        playerFuncs.emit.notification(player, fullMessage);
    }

    alt.emit(TlrpVehicleEvent.ENGINE_STATE_CHANGE, vehicle);
}

export default {
    engine,
    lock
};
