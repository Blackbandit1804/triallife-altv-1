import * as alt from 'alt-server';
import { Database, getDatabase } from 'simplymongo';
import { Vehicle_Behavior } from '../../../shared/utility/enums';
import { Vehicle } from '../../../shared/interfaces/vehicle';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { playerFuncs } from '../Player';

const db: Database = getDatabase();

async function data(owner: alt.Player, vehicle: alt.Vehicle): Promise<void> {
    if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_SAVE)) return;
    if (process.env.TEST) return;
    if (!vehicle.data) return;
    const index = owner.data.vehicles.findIndex((v) => v.uid === vehicle.data.uid);
    if (index <= -1) {
        vehicle.destroy();
        return;
    }
    if (!owner.data.vehicles[index]) {
        vehicle.destroy();
        return;
    }
    owner.data.vehicles[index].position = vehicle.pos;
    owner.data.vehicles[index].rotation = vehicle.rot;
    owner.data.vehicles[index].fuel = vehicle.fuel;
    playerFuncs.save.field(owner, 'vehicles', owner.data.vehicles);
    playerFuncs.sync.vehicles(owner);
}

export default {
    data
};
