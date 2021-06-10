import * as alt from 'alt-server';
import { TLRP } from './tlrpLoader';
const tlrp = TLRP.getFunctions('tlrp');
export function distance(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined)
        throw new Error('AddVector => vector1 or vector2 is undefined');
    return tlrp.Math.distance3d(vector1.x, vector1.y, vector1.z, vector2.x, vector2.y, vector2.z);
}
export function distance2d(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined)
        throw new Error('AddVector => vector1 or vector2 is undefined');
    return tlrp.Math.distance2d(vector1.x, vector1.y, vector2.x, vector2.y);
}
export function getForwardVector(rot) {
    return { x: tlrp.Math.fwdX(rot.x, rot.z), y: tlrp.Math.fwdY(rot.x, rot.z), z: tlrp.Math.fwdZ(rot.x) };
}
export function getVectorInFrontOfPlayer(player, distance) {
    const forwardVector = getForwardVector(player.rot);
    const posFront = {
        x: tlrp.Math.add(player.pos.x, tlrp.Math.multiply(forwardVector.x, distance)),
        y: tlrp.Math.add(player.pos.y, tlrp.Math.multiply(forwardVector.y, distance)),
        z: player.pos.z
    };
    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
}
export function isBetweenVectors(pos, vector1, vector2) {
    const validX = tlrp.Math.isGreater(pos.x, vector1.x) && tlrp.Math.isLesser(pos.x, vector2.x);
    const validY = tlrp.Math.isGreater(pos.y, vector1.y) && tlrp.Math.isLesser(pos.y, vector2.y);
    return validX && validY ? true : false;
}
export function getClosestEntity(playerPosition, rot, entities, distance) {
    const fwdVector = getForwardVector(rot);
    const position = {
        x: tlrp.Math.add(playerPosition.x, tlrp.Math.multiply(fwdVector.x, distance)),
        y: tlrp.Math.add(playerPosition.y, tlrp.Math.multiply(fwdVector.y, distance)),
        z: playerPosition.z
    };
    let lastRange = 25;
    let closestEntity;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (!entity || !entity.valid)
            continue;
        const dist = distance2d(position, entity.pos);
        if (tlrp.Math.isGreater(dist, lastRange))
            continue;
        closestEntity = entity;
        lastRange = dist;
    }
    return closestEntity;
}
