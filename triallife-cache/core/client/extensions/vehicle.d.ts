/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import { Vector3 } from 'alt-client';
import { Vehicle_Lock_State } from '../../shared/utility/enums';
export interface DoorData {
    pos: Vector3;
    seat: number;
    isDoor?: boolean;
}
declare module 'alt-client' {
    interface Vehicle {
        doorStates: {
            [doorNumber: number]: boolean;
        };
        owner: number;
        engineStatus: boolean;
        lockStatus: number | Vehicle_Lock_State;
        fuel: number;
    }
}
declare const _default: {
    get: {
        closestDoor: (v: alt.Vehicle, position: alt.Vector3) => DoorData;
        doorOpen: (v: alt.Vehicle, door: import("../../shared/utility/enums").Vehicle_Door_List) => boolean;
        owner: (v: alt.Vehicle) => boolean;
        canExit: (v: alt.Vehicle) => boolean;
    };
    set: {
        allDoorsClosed: (v: alt.Vehicle) => void;
        doorState: (v: alt.Vehicle, door: any, value: boolean) => void;
        engine: (v: alt.Vehicle, value: boolean) => void;
        fuel: (v: alt.Vehicle, value: number) => void;
        owner: (v: alt.Vehicle, id: number) => void;
        lockStatus: (v: alt.Vehicle, status: any) => void;
    };
    play: {
        carHorn: (v: alt.Vehicle, numberOfTimes: number, lengthOfHorn: number) => Promise<void>;
        lights: (v: alt.Vehicle, numberOfTimes: number, delay: number) => Promise<void>;
    };
    sync: {
        update: (v: alt.Vehicle) => void;
    };
    toggle: {
        door: (v: alt.Vehicle, door: any) => void;
    };
};
export default _default;
