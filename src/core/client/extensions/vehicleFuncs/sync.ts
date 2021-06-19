import * as alt from 'alt-client';
import * as native from 'natives';
import { DoorState } from '../../utility/enums';

function update(v: alt.Vehicle): void {
    if (!v.doorStates) v.doorStates = {};
    v.engineStatus = v.getStreamSyncedMeta(DoorState.ENGINE);
    v.doorStates[0] = v.getStreamSyncedMeta(DoorState.DOOR_DRIVER);
    v.doorStates[1] = v.getStreamSyncedMeta(DoorState.DOOR_PASSENGER);
    v.doorStates[2] = v.getStreamSyncedMeta(DoorState.DOOR_DRIVER_REAR);
    v.doorStates[3] = v.getStreamSyncedMeta(DoorState.DOOR_PASSENGER_REAR);
    v.doorStates[4] = v.getStreamSyncedMeta(DoorState.DOOR_HOOD);
    v.doorStates[5] = v.getStreamSyncedMeta(DoorState.DOOR_TRUNK);
    v.lockStatus = v.getStreamSyncedMeta(DoorState.LOCK_STATE);
    v.fuel = v.getStreamSyncedMeta(DoorState.FUEL);
    v.owner = v.getStreamSyncedMeta(DoorState.OWNER);
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
