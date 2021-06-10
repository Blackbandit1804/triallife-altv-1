import * as alt from 'alt-server';
import { Vehicle_Behavior, Vehicle_State } from '../../../shared/utility/enums';
import { EVENTS_VEHICLE } from '../../enums';
import { sha256Random } from '../../utility/encryption';
import { playerFuncs } from '../Player';
const ownershipBehavior = Vehicle_Behavior.CONSUMES_FUEL | Vehicle_Behavior.NEED_KEY_TO_START;
const tmpBehavior = Vehicle_Behavior.NO_KEY_TO_LOCK | Vehicle_Behavior.NO_KEY_TO_START | Vehicle_Behavior.UNLIMITED_FUEL | Vehicle_Behavior.NO_SAVE;
function add(player, data) {
    data.uid = sha256Random(JSON.stringify(player.data));
    if (!player.data.vehicles)
        player.data.vehicles = [data];
    else
        player.data.vehicles.push(data);
    playerFuncs.save.field(player, 'vehicles', player.data.vehicles);
    playerFuncs.sync.vehicles(player);
    return spawn(player, data);
}
function remove(player, uid) {
    if (!player.data.vehicles)
        return false;
    const index = player.data.vehicles.findIndex((v) => v.uid === uid);
    if (index <= -1)
        return false;
    player.data.vehicles.splice(index, 1);
    playerFuncs.save.field(player, 'vehicles', player.data.vehicles);
    playerFuncs.sync.vehicles(player);
    return true;
}
function despawn(id, player = null) {
    const vehicle = alt.Vehicle.all.find((v) => v.id === id);
    if (!vehicle)
        return false;
    if (vehicle.valid && vehicle.destroy) {
        alt.emit(EVENTS_VEHICLE.DESPAWNED, vehicle);
        vehicle.destroy();
    }
    if (player && player.valid)
        player.lastVehicleID = null;
    return true;
}
function tempVehicle(player, model, pos, rot) {
    const vehicle = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z);
    vehicle.player_id = player.id;
    vehicle.behavior = tmpBehavior;
    vehicle.numberPlateText = 'MG TEMP';
    vehicle.setStreamSyncedMeta(Vehicle_State.OWNER, vehicle.player_id);
    return vehicle;
}
function spawn(player, data) {
    if (player.lastVehicleID !== null && player.lastVehicleID !== undefined) {
        const vehicle = alt.Vehicle.all.find((v) => v.id.toString() === player.lastVehicleID.toString());
        if (vehicle && vehicle.valid && vehicle.destroy) {
            try {
                vehicle.destroy();
            }
            catch (err) { }
        }
    }
    const vehicle = new alt.Vehicle(data.model, data.position.x, data.position.y, data.position.z, data.rotation.x, data.rotation.y, data.rotation.z);
    player.lastVehicleID = vehicle.id;
    if (data.fuel === null || data.fuel === undefined)
        data.fuel = 100;
    vehicle.data = data;
    vehicle.fuel = data.fuel;
    vehicle.player_id = player.id;
    vehicle.behavior = ownershipBehavior;
    let color;
    if (!data.color)
        color = new alt.RGBA(255, 255, 255, 255);
    else
        color = new alt.RGBA(data.color.r, data.color.g, data.color.b, 255);
    vehicle.customPrimaryColor = color;
    vehicle.customSecondaryColor = color;
    vehicle.numberPlateText = vehicle.data.uid.substring(0, 8);
    vehicle.setStreamSyncedMeta(Vehicle_State.OWNER, vehicle.player_id);
    alt.emit(EVENTS_VEHICLE.SPAWNED, vehicle);
    return vehicle;
}
export default {
    add,
    despawn,
    remove,
    spawn,
    tempVehicle
};
