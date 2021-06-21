import * as alt from 'alt-server';
import { VehicleBehavior, VehicleLock_State } from '../../../shared/utility/enums';
import { isFlagEnabled } from '../../../shared/utility/usefull';

function lockState(v: alt.Vehicle): VehicleLock_State {
    if (v.tlrpLockState === null || v.tlrpLockState === undefined) return VehicleLock_State.LOCKED;
    return v.tlrpLockState;
}

function hasFuel(v: alt.Vehicle): boolean {
    if (isFlagEnabled(v.behavior, VehicleBehavior.UNLIMITED_FUEL)) return true;
    return v.fuel > 0;
}

function isOwner(v: alt.Vehicle, target: alt.Player): boolean {
    if (v.player_id === null || v.player_id === undefined) return true;
    return v.player_id === target.id;
}

export default { isOwner, lockState, hasFuel };
