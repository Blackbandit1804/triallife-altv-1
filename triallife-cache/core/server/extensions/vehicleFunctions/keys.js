import { Vehicle_State } from '../../../shared/utility/enums';
function give(veh, target) {
    if (!veh.keys)
        veh.keys = [];
    const index = veh.keys.findIndex((x) => x === target.data._id.toString());
    if (index !== -1)
        return true;
    veh.setStreamSyncedMeta(Vehicle_State.KEYS, veh.keys);
    this.keys.push(target.data._id.toString());
    return true;
}
function has(veh, target) {
    if (!veh.keys)
        veh.keys = [];
    const index = veh.keys.findIndex((x) => x === target.data._id.toString());
    if (index <= -1)
        return false;
    return true;
}
function remove(veh, target) {
    if (!veh.keys)
        veh.keys = [];
    const index = veh.keys.findIndex((x) => x === target.data._id.toString());
    if (index <= -1)
        return true;
    veh.setStreamSyncedMeta(Vehicle_State.KEYS, veh.keys);
    veh.keys.splice(index, 1);
    return true;
}
export default {
    give,
    has,
    remove
};
