/// <reference types="@altv/types-client" />
import * as alt from 'alt-client';
import { Vehicle_Door_List } from '../../../shared/utility/enums';
import { DoorData } from '../vehicle';
declare function closestDoor(v: alt.Vehicle, position: alt.Vector3): DoorData;
declare function doorOpen(v: alt.Vehicle, door: Vehicle_Door_List): boolean;
declare function canExit(v: alt.Vehicle): boolean;
declare function owner(v: alt.Vehicle): boolean;
declare const _default: {
    closestDoor: typeof closestDoor;
    doorOpen: typeof doorOpen;
    owner: typeof owner;
    canExit: typeof canExit;
};
export default _default;
