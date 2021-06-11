import * as alt from 'alt-server';
import getter from './getter';
import { Behavior, DoorList, LockState, VehicleDoorState } from '../../../shared/enums/vehicle';
import keys from './keys';
import toggle from './toggle';
import { DefaultConfig } from '../../configs/settings';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { vehicleFuncs } from '../vehicle';
import { TlrpFunctions, WASM } from '../../utility/wasmLoader';

const wasm = WASM.getFunctions<TlrpFunctions>('ares');

function lock(v: alt.Vehicle, player: alt.Player, lockStatus: LockState): boolean {
    if (!isFlagEnabled(v.behavior, Behavior.NO_KEY_TO_LOCK)) {
        if (!getter.isOwner(v, player) && !keys.has(v, player)) {
            return false;
        }
    }

    v.lockStatus = lockStatus;
    v.setStreamSyncedMeta(VehicleDoorState.LOCK_STATE, v.lockStatus);

    // Automatically Close All Doors in Locked State
    if (v.lockStatus === LockState.LOCKED) {
        for (let i = 0; i < 6; i++) {
            doorOpen(v, player, i, false);
        }
    }

    return true;
}

function doorOpen(v: alt.Vehicle, player: alt.Player, index: DoorList, state: boolean, bypass: boolean = false): void {
    if (!isFlagEnabled(v.bodyHealth, Behavior.NO_KEY_TO_LOCK) && !bypass) {
        if (!getter.isOwner(v, player) && !keys.has(v, player) && getter.lockStatus(v) !== LockState.UNLOCKED) {
            return;
        }
    }

    // alt.log(`${doorName}: ${oppositeValue}`);
    const doorName = `DOOR_${DoorList[index]}`;
    if (!doorName) {
        return;
    }

    const stateName = VehicleDoorState[`${doorName}`];
    v.setStreamSyncedMeta(stateName, state);
}

function updateFuel(v: alt.Vehicle) {
    if (isFlagEnabled(v.behavior, Behavior.UNLIMITED_FUEL)) {
        v.fuel = 100;
        v.setSyncedMeta(VehicleDoorState.FUEL, v.fuel);
        return;
    }

    if (!v.engineStatus) {
        v.setSyncedMeta(VehicleDoorState.FUEL, v.fuel);
        return;
    }

    if (!isNaN(v.data.fuel)) {
        v.fuel = v.data.fuel;
    } else {
        v.fuel = 100;
        v.data.fuel = 100;
    }

    v.fuel = wasm.TlrpMath.sub(v.fuel, DefaultConfig.FUEL_LOSS_PER_PLAYER_TICK);

    if (v.fuel < 0) {
        v.fuel = 0;

        if (v.engineStatus) {
            toggle.engine(v, null, true);
        }
    }

    v.data.fuel = v.fuel;
    v.setStreamSyncedMeta(VehicleDoorState.FUEL, v.data.fuel);

    const owner = alt.Player.all.find((p) => p.valid && p.id === v.player_id);
    if (!owner) {
        try {
            v.destroy();
        } catch (err) {}
        return;
    }

    if (!v.nextSave || Date.now() > v.nextSave) {
        vehicleFuncs.save.data(owner, v);
        v.nextSave = Date.now() + Math.floor(Math.random() * 30000) + 10000;
    }
}

export default {
    lock,
    doorOpen,
    updateFuel
};
