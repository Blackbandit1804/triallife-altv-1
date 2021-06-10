import * as alt from 'alt-client';
import { Vehicle_Door_List, Vehicle_Lock_State } from '../../../shared/enums/vehicle';
declare function owner(v: alt.Vehicle, id: number): void;
declare function engine(v: alt.Vehicle, value: boolean): void;
declare function allDoorsClosed(v: alt.Vehicle): void;
declare function doorState(v: alt.Vehicle, door: Vehicle_Door_List, value: boolean): void;
declare function lockStatus(v: alt.Vehicle, status: Vehicle_Lock_State | number): void;
declare function fuel(v: alt.Vehicle, value: number): void;
declare const _default: {
    allDoorsClosed: typeof allDoorsClosed;
    doorState: typeof doorState;
    engine: typeof engine;
    fuel: typeof fuel;
    owner: typeof owner;
    lockStatus: typeof lockStatus;
};
export default _default;
