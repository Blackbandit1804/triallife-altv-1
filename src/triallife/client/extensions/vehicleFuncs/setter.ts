import * as alt from 'alt-client';
import * as native from 'natives';
import { DoorList, LockState } from '../../../shared/enums/vehicle';
import { BaseHUD, HudEventNames } from '../../views/hud/hud';

/**
 * Set the owner of this vehicle locally.
 * @param {*} id
 * @memberof Vehicle
 */
function owner(v: alt.Vehicle, id: number): void {
    v.owner = id;
}

/**
 * Set the engine status of the vehicle.
 * @param {boolean} value
 * @memberof Vehicle
 */
function engine(v: alt.Vehicle, value: boolean): void {
    v.engineStatus = value;
    native.setVehicleEngineOn(v.scriptID, value, false, false);

    if (alt.Player.local.vehicle === v) {
        BaseHUD.setHudStatus(HudEventNames.Fuel, v.fuel);
    }
}

/**
 * Force all doors to be closed.
 * @memberof Vehicle
 */
function allDoorsClosed(v: alt.Vehicle): void {
    if (!this.doorStates) {
        this.doorStates = {};
    }

    for (let doorIndex in DoorList) {
        v.doorStates[doorIndex] = false;

        if (!native.isVehicleDoorFullyOpen(v.scriptID, parseInt(doorIndex))) {
            continue;
        }

        native.setVehicleDoorShut(v.scriptID, parseInt(doorIndex), false);
    }
}

/**
 * Set the door state. True is open.
 * @param {DoorList} door
 * @param {boolean} value
 * @memberof Vehicle
 */
function doorState(v: alt.Vehicle, door: DoorList, value: boolean): void {
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

function lockStatus(v: alt.Vehicle, status: LockState | number) {
    v.lockStatus = status;
}

function fuel(v: alt.Vehicle, value: number) {
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
