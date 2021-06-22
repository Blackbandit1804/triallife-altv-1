import * as alt from 'alt-client';
import * as native from 'natives';
import { VehicleState } from '../../../shared/utility/enums';

function update(v: alt.Vehicle): void {
    if (!v.doorStates) v.doorStates = {};
    v.engineStatus = v.getStreamSyncedMeta(VehicleState.ENGINE);
    v.doorStates[0] = v.getStreamSyncedMeta(VehicleState.DOOR_DRIVER);
    v.doorStates[1] = v.getStreamSyncedMeta(VehicleState.DOOR_PASSENGER);
    v.doorStates[2] = v.getStreamSyncedMeta(VehicleState.DOOR_DRIVER_REAR);
    v.doorStates[3] = v.getStreamSyncedMeta(VehicleState.DOOR_PASSENGER_REAR);
    v.doorStates[4] = v.getStreamSyncedMeta(VehicleState.DOOR_HOOD);
    v.doorStates[5] = v.getStreamSyncedMeta(VehicleState.DOOR_TRUNK);
    v.lockStatus = v.getStreamSyncedMeta(VehicleState.LOCK_STATE);
    v.fuel = v.getStreamSyncedMeta(VehicleState.FUEL);
    v.owner = v.getStreamSyncedMeta(VehicleState.OWNER);
    native.setVehicleEngineOn(v.scriptID, v.engineStatus, false, false);
    Object.keys(v.doorStates).forEach((doorNumber) => {
        const angle = native.getVehicleDoorAngleRatio(v.scriptID, parseInt(doorNumber));
        if (v.doorStates[doorNumber]) {
            if (angle <= 0.3) native.setVehicleDoorOpen(v.scriptID, parseInt(doorNumber), false, false);
        } else {
            if (angle >= 0.1) native.setVehicleDoorShut(v.scriptID, parseInt(doorNumber), false);
        }
    });
}

export default {
    update
};
