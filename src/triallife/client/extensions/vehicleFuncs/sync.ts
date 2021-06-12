import * as alt from 'alt-client';
import * as native from 'natives';
import { VehicleDoorState } from '../../../shared/enums/vehicle';

function update(v: alt.Vehicle): void {
    // Synchronize All States for Local Data

    if (!v.doorStates) {
        v.doorStates = {};
    }

    v.engineStatus = v.getStreamSyncedMeta(VehicleDoorState.ENGINE);
    v.doorStates[0] = v.getStreamSyncedMeta(VehicleDoorState.DOOR_DRIVER);
    v.doorStates[1] = v.getStreamSyncedMeta(VehicleDoorState.DOOR_PASSENGER);
    v.doorStates[2] = v.getStreamSyncedMeta(VehicleDoorState.DOOR_DRIVER_REAR);
    v.doorStates[3] = v.getStreamSyncedMeta(VehicleDoorState.DOOR_PASSENGER_REAR);
    v.doorStates[4] = v.getStreamSyncedMeta(VehicleDoorState.DOOR_HOOD);
    v.doorStates[5] = v.getStreamSyncedMeta(VehicleDoorState.DOOR_TRUNK);
    v.lockStatus = v.getStreamSyncedMeta(VehicleDoorState.LOCK_STATE);
    v.fuel = v.getStreamSyncedMeta(VehicleDoorState.FUEL);
    v.owner = v.getStreamSyncedMeta(VehicleDoorState.OWNER);

    native.setVehicleEngineOn(v.scriptID, v.engineStatus, false, false);

    Object.keys(v.doorStates).forEach((doorNumber) => {
        const angle = native.getVehicleDoorAngleRatio(v.scriptID, parseInt(doorNumber));

        if (v.doorStates[doorNumber]) {
            if (angle <= 0.3) {
                native.setVehicleDoorOpen(v.scriptID, parseInt(doorNumber), false, false);
            }
        } else {
            if (angle >= 0.1) {
                native.setVehicleDoorShut(v.scriptID, parseInt(doorNumber), false);
            }
        }
    });
}

export default {
    update
};
