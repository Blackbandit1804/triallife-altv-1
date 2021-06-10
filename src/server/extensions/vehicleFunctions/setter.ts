import * as alt from 'alt-server';
import getter from './getter';
import { BehaviorTypes, DoorTypes, LockTypes, VehicleStates } from '../../../shared/utility/enums';
import keys from './keys';
import toggle from './toggle';
import { DEFAULT_CONFIG } from '../../configs/settings';
import { isFlagEnabled } from '../../../shared/utility/usefull';
import { vehicleFuncs } from '../vehicle';
import * as TlrpMath from '../math';

function lock(v: alt.Vehicle, player: alt.Player, lockState: LockTypes): boolean {
    if (!isFlagEnabled(v.behavior, BehaviorTypes.NO_KEY_TO_LOCK)) if (!getter.isOwner(v, player) && !keys.has(v, player)) return false;
    v.lockStatus = lockState;
    v.setStreamSyncedMeta(VehicleStates.LOCK_STATE, v.lockStatus);
    if (v.lockStatus === LockTypes.LOCKED) for (let i = 0; i < 6; i++) doorOpen(v, player, i, false);
    return true;
}

function doorOpen(v: alt.Vehicle, player: alt.Player, index: DoorTypes, state: boolean, bypass: boolean = false): void {
    if (!isFlagEnabled(v.bodyHealth, BehaviorTypes.NO_KEY_TO_LOCK) && !bypass)
        if (!getter.isOwner(v, player) && !keys.has(v, player) && getter.lockState(v) !== LockTypes.UNLOCKED) return;
    const doorName = `DOOR_${DoorTypes[index]}`;
    if (!doorName) return;
    const stateName = VehicleStates[`${doorName}`];
    v.setStreamSyncedMeta(stateName, state);
}

function updateFuel(v: alt.Vehicle) {
    if (isFlagEnabled(v.behavior, BehaviorTypes.UNLIMITED_FUEL)) {
        v.fuel = 100;
        v.setSyncedMeta(VehicleStates.FUEL, v.fuel);
        return;
    }
    if (!v.engineStatus) {
        v.setSyncedMeta(VehicleStates.FUEL, v.fuel);
        return;
    }
    if (!isNaN(v.data.fuel)) v.fuel = v.data.fuel;
    else {
        v.fuel = 100;
        v.data.fuel = 100;
    }
    v.fuel = TlrpMath.sub(v.fuel, DEFAULT_CONFIG.FUEL_LOSS_PER_PLAYER_TICK);
    if (v.fuel < 0) {
        v.fuel = 0;
        if (v.engineStatus) toggle.engine(v, null, true);
    }
    v.data.fuel = v.fuel;
    v.setStreamSyncedMeta(VehicleStates.FUEL, v.data.fuel);
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
