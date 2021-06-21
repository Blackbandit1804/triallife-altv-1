import * as alt from 'alt-server';
import { getClosestTypes } from '../../../shared/utility/usefull';
import { distance, distance2d, getClosestEntity, getForwardVector } from '../../utility/vector';

function getPositionFrontOf(p: alt.Player, distance: number) {
    const fwdVector = getForwardVector(p.rot);
    return new alt.Vector3(p.pos.x + fwdVector.x * distance, p.pos.y + fwdVector.y * distance, p.pos.z);
}

function getDistanceTo2D(p: alt.Player, position: alt.Vector3): number {
    return distance2d(p.pos, position);
}

function getDistanceTo3D(p: alt.Player, position: alt.Vector3): number {
    return distance(p.pos, position);
}

function getVehicleInFrontOf(p: alt.Player, distance: number): alt.Vehicle | null {
    return getClosestEntity<alt.Vehicle>(p.pos, p.rot, [...alt.Vehicle.all], distance);
}

function getPlayerInFrontOf(p: alt.Player, distance: number): alt.Player | null {
    return getClosestEntity<alt.Player>(p.pos, p.rot, [...alt.Player.all], distance);
}

function getClosestPlayers(p: alt.Player, distance: number): Array<alt.Player> {
    return getClosestTypes<alt.Player>(p.pos, alt.Player.all, distance, ['data', 'discord', 'accountData']);
}

export default {
    getClosestPlayers,
    getDistanceTo2D,
    getDistanceTo3D,
    getPlayerInFrontOf,
    getPositionFrontOf,
    getVehicleInFrontOf
};
