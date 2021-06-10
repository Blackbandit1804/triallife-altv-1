import * as alt from 'alt-server';
import { Vehicle_Door_List, Vehicle_Lock_State } from '../../../shared/utility/enums';
declare function lock(v: alt.Vehicle, player: alt.Player, lockState: Vehicle_Lock_State): boolean;
declare function doorOpen(v: alt.Vehicle, player: alt.Player, index: Vehicle_Door_List, state: boolean, bypass?: boolean): void;
declare function updateFuel(v: alt.Vehicle): void;
declare const _default: {
    lock: typeof lock;
    doorOpen: typeof doorOpen;
    updateFuel: typeof updateFuel;
};
export default _default;
