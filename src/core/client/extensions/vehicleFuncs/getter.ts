import * as alt from 'alt-client';
import * as native from 'natives';
import { VehicleDoorList, VehicleLock_State } from '../../../shared/utility/enums';
import { getClosestVectorByPos } from '../../utility/vector';
import { DoorData } from '../vehicle';

const closestDoorBones = [
    { name: 'handle_dside_f', seat: -1, isDoor: false },
    { name: 'handle_pside_f', seat: 0, isDoor: false },
    { name: 'handle_dside_r', seat: 1, isDoor: false },
    { name: 'handle_pside_r', seat: 2, isDoor: false },
    { name: 'bonnet', seat: 4, isDoor: true },
    { name: 'boot', seat: 5, isDoor: true }
];

function closestDoor(v: alt.Vehicle, position: alt.Vector3): DoorData {
    const positions: { index: number; pos: alt.Vector3 }[] = [];
    for (let i = 0; i < closestDoorBones.length; i++) {
        const boneIndex = native.getEntityBoneIndexByName(v.scriptID, closestDoorBones[i].name);
        const worldPos = native.getWorldPositionOfEntityBone(v.scriptID, boneIndex);
        positions.push({ index: i, pos: worldPos as alt.Vector3 });
    }
    const closestPos = getClosestVectorByPos<{ index: number; pos: alt.Vector3 }>(position, positions);
    const seat = closestDoorBones[closestPos.index].seat;
    const isDoor = closestDoorBones[closestPos.index].isDoor;
    return { pos: closestPos.pos, seat: seat, isDoor: isDoor };
}

function doorOpen(v: alt.Vehicle, door: VehicleDoorList): boolean {
    if (!v.doorStates) return false;
    if (!v.doorStates[door]) return false;
    return v.doorStates[door];
}

function canExit(v: alt.Vehicle) {
    return v.lockStatus === VehicleLock_State.UNLOCKED || v.lockStatus === VehicleLock_State.NO_LOCK;
}

function owner(v: alt.Vehicle): boolean {
    return v.owner === alt.Player.local.id;
}

export default {
    closestDoor,
    doorOpen,
    owner,
    canExit
};
