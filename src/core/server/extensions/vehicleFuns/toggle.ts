import * as alt from 'alt-server';
import { VehicleBehavior, VehicleLock_State, VehicleLock_States, VehicleState } from '../../../shared/utility/enums';
import { isFlagEnabled } from '../../../shared/utility/usefull';
import { TlrpEvent } from '../../utility/enums';
import { playerFuncs } from '../Player';
import getter from './getter';
import keys from './keys';
import setter from './setter';

function lock(vehicle: alt.Vehicle, player: alt.Player, bypass: boolean = false): VehicleLock_State {
    if (!bypass) {
        if (!getter.isOwner(vehicle, player) && !keys.has(vehicle, player)) {
            return vehicle.tlrpLockState;
        }
    }
    if (vehicle.tlrpLockState === null || vehicle.tlrpLockState === undefined) {
        vehicle.tlrpLockState = VehicleLock_State.UNLOCKED;
        for (let i = 0; i < 6; i++) setter.doorOpen(vehicle, player, i, false);
        vehicle.setStreamSyncedMeta(VehicleState.LOCK_STATE, vehicle.tlrpLockState);
        return vehicle.tlrpLockState;
    }
    let index = VehicleLock_States.findIndex((x) => x === vehicle.tlrpLockState);
    if (index + 1 === VehicleLock_States.length) index = -1;
    vehicle.tlrpLockState = VehicleLock_States[index + 1];
    vehicle.setStreamSyncedMeta(VehicleState.LOCK_STATE, vehicle.tlrpLockState);
    if (vehicle.tlrpLockState === VehicleLock_State.LOCKED) {
        for (let i = 0; i < 6; i++) {
            setter.doorOpen(vehicle, player, i, false);
        }
    }
    alt.emit(TlrpEvent.VEHICLE_LOCK_STATE_CHANGE, vehicle);
    return vehicle.tlrpLockState;
}

function engine(vehicle: alt.Vehicle, player: alt.Player, bypass: boolean = false): void {
    if (isFlagEnabled(vehicle.behavior, VehicleBehavior.NEED_KEY_TO_START) && !bypass) {
        if (!getter.isOwner(vehicle, player) && !keys.has(vehicle, player)) {
            return;
        }
    }
    if (!getter.hasFuel(vehicle)) {
        vehicle.engineStatus = false;
        vehicle.setStreamSyncedMeta(VehicleState.ENGINE, vehicle.engineStatus);
        playerFuncs.emit.notification(player, 'Der Tank ist leer');
        return;
    }
    vehicle.engineStatus = !vehicle.engineStatus;
    vehicle.setStreamSyncedMeta(VehicleState.ENGINE, vehicle.engineStatus);

    if (player) {
        const status = vehicle.engineStatus ? 'AN' : 'AUS';
        const fullMessage = `Motor ~y~ ${status}`;
        playerFuncs.emit.notification(player, fullMessage);
    }
    alt.emit(TlrpEvent.VEHICLE_ENGINE_STATE_CHANGE, vehicle);
}

export default { engine, lock };
