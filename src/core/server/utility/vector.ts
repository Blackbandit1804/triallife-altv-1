import * as alt from 'alt-server';
import * as TlrpMath from './math';

export function distance(vector1: alt.IVector3, vector2: alt.IVector3) {
    if (vector1 === undefined || vector2 === undefined) throw new Error('AddVector => vector1 or vector2 is undefined');
    return TlrpMath.distance3d(vector1.x, vector1.y, vector1.z, vector2.x, vector2.y, vector2.z);
}

export function distance2d(vector1: alt.IVector3, vector2: alt.IVector3) {
    if (vector1 === undefined || vector2 === undefined) throw new Error('AddVector => vector1 or vector2 is undefined');
    return TlrpMath.distance2d(vector1.x, vector1.y, vector2.x, vector2.y);
}

export function getForwardVector(rot: alt.Vector3): alt.Vector3 {
    return { x: TlrpMath.fwdX(rot.x, rot.z), y: TlrpMath.fwdY(rot.x, rot.z), z: TlrpMath.fwdZ(rot.x) } as alt.Vector3;
}

export function getVectorInFrontOfPlayer(player: alt.Player, distance: number): alt.Vector3 {
    const forwardVector = getForwardVector(player.rot);
    const posFront = {
        x: TlrpMath.add(player.pos.x, TlrpMath.multiply(forwardVector.x, distance)),
        y: TlrpMath.add(player.pos.y, TlrpMath.multiply(forwardVector.y, distance)),
        z: player.pos.z
    };
    return new alt.Vector3(posFront.x, posFront.y, posFront.z);
}

export function isBetweenVectors(pos, vector1, vector2): boolean {
    const validX = TlrpMath.isGreater(pos.x, vector1.x) && TlrpMath.isLesser(pos.x, vector2.x);
    const validY = TlrpMath.isGreater(pos.y, vector1.y) && TlrpMath.isLesser(pos.y, vector2.y);
    return validX && validY ? true : false;
}

export function getClosestEntity<T>(playerPosition: alt.Vector3, rot: alt.Vector3, entities: Array<{ pos: alt.Vector3; valid?: boolean }>, distance: number): T | null {
    const fwdVector = getForwardVector(rot);
    const position = {
        x: TlrpMath.add(playerPosition.x, TlrpMath.multiply(fwdVector.x, distance)),
        y: TlrpMath.add(playerPosition.y, TlrpMath.multiply(fwdVector.y, distance)),
        z: playerPosition.z
    };
    let lastRange = 25;
    let closestEntity;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (!entity || !entity.valid) continue;
        const dist = distance2d(position, entity.pos);
        if (TlrpMath.isGreater(dist, lastRange)) continue;
        closestEntity = entity;
        lastRange = dist;
    }
    return closestEntity;
}
