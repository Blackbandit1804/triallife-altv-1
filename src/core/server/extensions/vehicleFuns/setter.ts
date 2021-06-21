import * as alt from 'alt-server';
import getter from './getter';
import { VehicleBehavior, VehicleDoorList, VehicleLock_State, VehicleState } from '../../../shared/utility/enums';
import keys from './keys';
import toggle from './toggle';
import { DefaultConfig } from '../../configs/settings';
import { isFlagEnabled } from '../../../shared/utility/usefull';
import { vehicleFuncs } from '../vehicle';
import * as TlrpMath from '../../utility/math';

function lock(v: alt.Vehicle, player: alt.Player, lockState: VehicleLock_State): boolean {
    if (!isFlagEnabled(v.behavior, VehicleBehavior.NO_KEY_TO_LOCK)) {
        if (!getter.isOwner(v, player) && !keys.has(v, player)) {
            return false;
        }
    }
    v.tlrpLockState = lockState;
    v.setStreamSyncedMeta(VehicleState.LOCK_STATE, v.tlrpLockState);
    if (v.tlrpLockState === VehicleLock_State.LOCKED) {
        for (let i = 0; i < 6; i++) {
            doorOpen(v, player, i, false);
        }
    }
    return true;
}

function doorOpen(v: alt.Vehicle, player: alt.Player, index: VehicleDoorList, state: boolean, bypass: boolean = false): void {
    if (!isFlagEnabled(v.bodyHealth, VehicleBehavior.NO_KEY_TO_LOCK) && !bypass) {
        if (!getter.isOwner(v, player) && !keys.has(v, player) && getter.lockState(v) !== VehicleLock_State.UNLOCKED) {
            return;
        }
    }
    const doorName = `DOOR_${VehicleDoorList[index]}`;
    if (!doorName) return;
    const stateName = VehicleState[`${doorName}`];
    v.setStreamSyncedMeta(stateName, state);
}

function updateFuel(v: alt.Vehicle) {
    if (isFlagEnabled(v.behavior, VehicleBehavior.UNLIMITED_FUEL)) {
        v.fuel = 100;
        v.setSyncedMeta(VehicleState.FUEL, v.fuel);
        return;
    }
    if (!v.engineStatus) {
        v.setSyncedMeta(VehicleState.FUEL, v.fuel);
        return;
    }
    if (!isNaN(v.data.fuel)) v.fuel = v.data.fuel;
    else {
        v.fuel = 100;
        v.data.fuel = 100;
    }
    v.fuel = TlrpMath.sub(v.fuel, DefaultConfig.FUEL_LOSS_PER_PLAYER_TICK);
    if (v.fuel < 0) {
        v.fuel = 0;
        if (v.engineStatus) toggle.engine(v, null, true);
    }
    v.data.fuel = v.fuel;
    v.setStreamSyncedMeta(VehicleState.FUEL, v.data.fuel);
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

export default { lock, doorOpen, updateFuel };
