import * as alt from 'alt-server';
import { VehicleState } from '../../../shared/utility/enums';

function give(v: alt.Vehicle, target: alt.Player): boolean {
    if (!v.keys) v.keys = [];
    const index = v.keys.findIndex((x) => x === target.data._id.toString());
    if (index !== -1) return true;
    v.setStreamSyncedMeta(VehicleState.KEYS, v.keys);
    this.keys.push(target.data._id.toString());
    return true;
}

function has(v: alt.Vehicle, target: alt.Player): boolean {
    if (!v.keys) v.keys = [];
    const index = v.keys.findIndex((x: string) => x === target.data._id.toString());
    return index !== -1;
}

function remove(v: alt.Vehicle, target: alt.Player): boolean {
    if (!v.keys) v.keys = [];
    const index = v.keys.findIndex((x) => x === target.data._id.toString());
    if (index <= -1) return true;
    v.setStreamSyncedMeta(VehicleState.KEYS, v.keys);
    v.keys.splice(index, 1);
    return true;
}

export default { give, has, remove };
