import * as alt from 'alt-server';
import { SystemEvent } from '../../shared/enums/system';
import { DoorList, VehicleEvent, LockState, VehicleDoorState } from '../../shared/enums/vehicle';
import { AnimationFlag } from '../../shared/enums/animation';
import { Vehicle } from '../../shared/interfaces/vehicle';
import { playerFuncs } from '../extensions/player';
import { vehicleFuncs } from '../extensions/vehicle';
import { getPlayersByGridSpace } from '../utility/filters';
import './fuel';
import '../views/dealership';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

alt.on('playerEnteredVehicle', handleEnterVehicle);
alt.onClient(VehicleEvent.SET_LOCK, handleCycleLock);
alt.onClient(VehicleEvent.SET_DOOR, handleSetDoor);
alt.onClient(VehicleEvent.SET_ENGINE, handleSetEngine);
alt.onClient(SystemEvent.VEHICLES_VIEW_SPAWN, handleSpawn);
alt.onClient(SystemEvent.VEHICLES_VIEW_DESPAWN, handleDespawn);

function handleEnterVehicle(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
    const actualSeat = seat - 1;
    vehicleFuncs.setter.doorOpen(vehicle, player, actualSeat, false);
    player.lastEnteredVehicleID = vehicle.id;
    if (!vehicle) return;
    if (!vehicle.behavior) {
        vehicle.destroy();
        return;
    }
    vehicleFuncs.setter.updateFuel(vehicle);
}

function handleSetEngine(player: alt.Player): void {
    if (!player || !player.valid || !player.vehicle) return;
    const vehicle: alt.Vehicle = player.vehicle;
    vehicleFuncs.toggle.engine(vehicle, player);
}

function handleCycleLock(player: alt.Player, vehicle: alt.Vehicle): void {
    if (!player || !player.valid) return;
    if (!vehicle || !vehicle.valid) return;
    const lockState = vehicleFuncs.toggle.lock(vehicle, player, false);
    playerFuncs.emit.notification(player, LocaleController.get(LOCALE_KEYS.VEHICLE_LOCK_SET_TO, LockState[lockState].replace('_', ' ')));
    if (lockState !== LockState.LOCKED && lockState !== LockState.UNLOCKED) return;
    if (!player.vehicle) {
        playerFuncs.emit.animation(player, `anim@mp_player_intmenu@key_fob@`, 'fob_click_fp', AnimationFlag.UPPERBODY_ONLY | AnimationFlag.ENABLE_PLAYER_CONTROL, -1);
    }
    const soundName = lockState === LockState.UNLOCKED ? 'car_unlock' : 'car_lock';
    const playersNearPlayer = getPlayersByGridSpace(player, 8);
    playersNearPlayer.forEach((target) => playerFuncs.emit.sound3D(target, soundName, vehicle));
}

function handleSetDoor(player: alt.Player, vehicle: alt.Vehicle, doorIndex: DoorList): void {
    if (!player || !player.valid) return;
    if (!vehicle || !vehicle.valid) return;
    const doorName = `DOOR_${DoorList[doorIndex]}`;
    const oppositeValue = !vehicle.getStreamSyncedMeta(VehicleDoorState[doorName]) ? true : false;
    vehicleFuncs.setter.doorOpen(vehicle, player, doorIndex, oppositeValue);
}

function handleSpawn(player: alt.Player, index: number) {
    if (!player.data.vehicles) return;
    if (index <= -1) return;
    if (index >= player.data.vehicles.length) return;
    const vehicleData = player.data.vehicles[index];
    if (!vehicleData) return;
    vehicleFuncs.create.spawn(player, vehicleData as Vehicle);
}

function handleDespawn(player: alt.Player) {
    if (!player.data.vehicles) return;
    if (player.lastVehicleID === null || player.lastVehicleID === undefined) return;
    const vehicle = alt.Vehicle.all.find((veh) => veh && veh.id === player.lastVehicleID);
    if (!vehicle) return;
    vehicleFuncs.create.despawn(vehicle.id, player);
}
