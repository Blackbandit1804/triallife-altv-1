import { Vehicle_Behavior, Vehicle_Lock_State } from '../../../shared/utility/enums';
import { isFlagEnabled } from '../../../shared/utility/flags';
function lockState(v) {
    if (v.lockStatus === null || v.lockStatus === undefined)
        return Vehicle_Lock_State.LOCKED;
    return v.lockStatus;
}
function hasFuel(v) {
    if (isFlagEnabled(v.behavior, Vehicle_Behavior.UNLIMITED_FUEL))
        return true;
    if (v.fuel <= 0)
        return false;
    return true;
}
function isOwner(v, target) {
    if (v.player_id === null || v.player_id === undefined)
        return true;
    if (v.player_id !== target.id)
        return false;
    return true;
}
export default { isOwner, lockState, hasFuel };
