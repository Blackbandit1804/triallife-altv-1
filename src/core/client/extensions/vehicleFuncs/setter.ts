import * as alt from 'alt-client';
import * as native from 'natives';
import { HudEventNames } from '../../../shared/utility/enums';
import { VehicleDoorList, VehicleLock_State } from '../../../shared/utility/enums';
import { HUD } from '../../views/hud/hud';

function owner(v: alt.Vehicle, id: number): void {
    v.owner = id;
}

function engine(v: alt.Vehicle, value: boolean): void {
    v.engineStatus = value;
    native.setVehicleEngineOn(v.scriptID, value, false, false);
    if (alt.Player.local.vehicle === v) HUD.setHudStatus(HudEventNames.Fuel, v.fuel);
}

function allDoorsClosed(v: alt.Vehicle): void {
    if (!this.doorStates) this.doorStates = {};
    for (let doorIndex in VehicleDoorList) {
        v.doorStates[doorIndex] = false;
        if (!native.isVehicleDoorFullyOpen(v.scriptID, parseInt(doorIndex))) continue;
        native.setVehicleDoorShut(v.scriptID, parseInt(doorIndex), false);
    }
}

function doorState(v: alt.Vehicle, door: VehicleDoorList, value: boolean): void {
    if (!v.doorStates) v.doorStates = {};
    v.doorStates[door] = value;
    if (!v.doorStates[door]) {
        native.setVehicleDoorShut(v.scriptID, door, false);
        return;
    }
    native.setVehicleDoorOpen(v.scriptID, door, false, false);
}

function lockStatus(v: alt.Vehicle, status: VehicleLock_State | number) {
    v.lockStatus = status;
}

function fuel(v: alt.Vehicle, value: number) {
    v.fuel = value;
    if (!alt.Player.local.vehicle) return;
    if (alt.Player.local.vehicle.id === v.id) HUD.setHudStatus(HudEventNames.Fuel, value);
}

export default {
    allDoorsClosed,
    doorState,
    engine,
    fuel,
    owner,
    lockStatus
};
