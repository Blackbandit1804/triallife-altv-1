import { getDatabase } from 'simplymongo';
import { Vehicle_Behavior } from '../../../shared/utility/enums';
import { isFlagEnabled } from '../../../shared/utility/flags';
import { playerFuncs } from '../Player';
const db = getDatabase();
async function data(owner, vehicle) {
    if (isFlagEnabled(vehicle.behavior, Vehicle_Behavior.NO_SAVE))
        return;
    if (process.env.TEST)
        return;
    if (!vehicle.data)
        return;
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
