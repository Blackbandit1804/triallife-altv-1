import * as alt from 'alt-server';
import { getClosestTypes } from '../../../shared/utility/vector';
import { distance, distance2d, getClosestEntity, getForwardVector } from '../../utility/vector';
function getPositionFrontOf(p, distance) {
    const fwdVector = getForwardVector(p.rot);
    return new alt.Vector3(p.pos.x + fwdVector.x * distance, p.pos.y + fwdVector.y * distance, p.pos.z);
}
function getDistanceTo2D(p, position) {
    return distance2d(p.pos, position);
}
function getDistanceTo3D(p, position) {
    return distance(p.pos, position);
}
function getVehicleInFrontOf(p, distance) {
    return getClosestEntity(p.pos, p.rot, [...alt.Vehicle.all], distance);
}
function getPlayerInFrontOf(p, distance) {
    return getClosestEntity(p.pos, p.rot, [...alt.Player.all], distance);
}
function getClosestPlayers(p, distance) {
    return getClosestTypes(p.pos, alt.Player.all, distance, ['data', 'discord', 'accountData']);
}
export default {
    getClosestPlayers,
    getDistanceTo2D,
    getDistanceTo3D,
    getPlayerInFrontOf,
    getPositionFrontOf,
    getVehicleInFrontOf
};
