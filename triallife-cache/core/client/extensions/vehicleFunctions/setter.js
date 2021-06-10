import * as alt from 'alt-client';
import * as native from 'natives';
import { Vehicle_Door_List } from '../../../shared/enums/vehicle';
import { BaseHUD, HudEventNames } from '../../views/hud/hud';
function owner(v, id) {
    v.owner = id;
}
function engine(v, value) {
    v.engineStatus = value;
    native.setVehicleEngineOn(v.scriptID, value, false, false);
    if (alt.Player.local.vehicle === v) {
        BaseHUD.setHudStatus(HudEventNames.Fuel, v.fuel);
    }
}
function allDoorsClosed(v) {
    if (!this.doorStates) {
        this.doorStates = {};
    }
    for (let doorIndex in Vehicle_Door_List) {
        v.doorStates[doorIndex] = false;
        if (!native.isVehicleDoorFullyOpen(v.scriptID, parseInt(doorIndex))) {
            continue;
        }
        native.setVehicleDoorShut(v.scriptID, parseInt(doorIndex), false);
    }
}
function doorState(v, door, value) {
    if (!v.doorStates) {
        v.doorStates = {};
    }
    v.doorStates[door] = value;
    if (!v.doorStates[door]) {
        native.setVehicleDoorShut(v.scriptID, door, false);
        return;
    }
    native.setVehicleDoorOpen(v.scriptID, door, false, false);
}
function lockStatus(v, status) {
    v.lockStatus = status;
}
function fuel(v, value) {
    v.fuel = value;
    if (!alt.Player.local.vehicle) {
        return;
    }
    if (alt.Player.local.vehicle.id === v.id) {
        BaseHUD.setHudStatus(HudEventNames.Fuel, value);
    }
}
export default {
    allDoorsClosed,
    doorState,
    engine,
    fuel,
    owner,
    lockStatus
};
