import * as alt from 'alt-server';
import { Vehicle_State } from '../../../shared/utility/enums';

function give(veh: alt.Vehicle, target: alt.Player): boolean {
    if (!veh.keys) veh.keys = [];
    const index = veh.keys.findIndex((x) => x === target.data._id.toString());
    if (index !== -1) return true;
    veh.setStreamSyncedMeta(Vehicle_State.KEYS, veh.keys);
    this.keys.push(target.data._id.toString());
    return true;
}

function has(veh: alt.Vehicle, target: alt.Player): boolean {
    if (!veh.keys) veh.keys = [];
    const index = veh.keys.findIndex((x: string) => x === target.data._id.toString());
    if (index <= -1) return false;
    return true;
}

function remove(veh: alt.Vehicle, target: alt.Player): boolean {
    if (!veh.keys) veh.keys = [];
    const index = veh.keys.findIndex((x) => x === target.data._id.toString());
    if (index <= -1) return true;
    veh.setStreamSyncedMeta(Vehicle_State.KEYS, veh.keys);
    veh.keys.splice(index, 1);
    return true;
}

export default {
    give,
    has,
    remove
};
