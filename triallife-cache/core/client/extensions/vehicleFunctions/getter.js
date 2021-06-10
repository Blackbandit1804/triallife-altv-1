import * as alt from 'alt-client';
import * as native from 'natives';
import { Vehicle_Lock_State } from '../../../shared/utility/enums';
import { getClosestVectorByPos } from '../../../shared/utility/vector';
const closestDoorBones = [
    { name: 'handle_dside_f', seat: -1, isDoor: false },
    { name: 'handle_pside_f', seat: 0, isDoor: false },
    { name: 'handle_dside_r', seat: 1, isDoor: false },
    { name: 'handle_pside_r', seat: 2, isDoor: false },
    { name: 'bonnet', seat: 4, isDoor: true },
    { name: 'boot', seat: 5, isDoor: true }
];
function closestDoor(v, position) {
    const positions = [];
    for (let i = 0; i < closestDoorBones.length; i++) {
        const boneIndex = native.getEntityBoneIndexByName(v.scriptID, closestDoorBones[i].name);
        const worldPos = native.getWorldPositionOfEntityBone(v.scriptID, boneIndex);
        positions.push({ index: i, pos: worldPos });
    }
    const closestPos = getClosestVectorByPos(position, positions);
    const seat = closestDoorBones[closestPos.index].seat;
    const isDoor = closestDoorBones[closestPos.index].isDoor;
    return { pos: closestPos.pos, seat: seat, isDoor: isDoor };
}
function doorOpen(v, door) {
    if (!v.doorStates) {
        return false;
    }
    if (!v.doorStates[door]) {
        return false;
    }
    return v.doorStates[door];
}
function canExit(v) {
    if (v.lockStatus === Vehicle_Lock_State.UNLOCKED || v.lockStatus === Vehicle_Lock_State.NO_LOCK) {
        return true;
    }
    return false;
}
function owner(v) {
    return v.owner === alt.Player.local.id;
}
export default {
    closestDoor,
    doorOpen,
    owner,
    canExit
};
