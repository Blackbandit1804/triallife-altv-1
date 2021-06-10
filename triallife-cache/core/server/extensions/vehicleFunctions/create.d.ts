/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Vehicle } from '../../../shared/interfaces/Vehicle';
declare function add(player: alt.Player, data: Partial<Vehicle>): alt.Vehicle;
declare function remove(player: alt.Player, uid: string): boolean;
declare function despawn(id: number, player?: alt.Player): boolean;
declare function tempVehicle(player: alt.Player, model: string, pos: alt.IVector3, rot: alt.IVector3): alt.Vehicle;
declare function spawn(player: alt.Player, data: Vehicle): alt.Vehicle;
declare const _default: {
    add: typeof add;
    despawn: typeof despawn;
    remove: typeof remove;
    spawn: typeof spawn;
    tempVehicle: typeof tempVehicle;
};
export default _default;
