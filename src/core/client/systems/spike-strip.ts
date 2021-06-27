/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-client';
import * as native from 'natives';
import { SystemEvent } from '../../shared/utility/enums';

interface SpikeStrip {
    uid: any;
    hash: string;
    pos: alt.Vector3;
    rot: alt.Vector3;
    handle: number;
}

const addedSpikes: Array<SpikeStrip> = [];
const spikeModel = native.getHashKey('P_ld_stinger_s');
native.requestModel(spikeModel);

function create(spikeData: SpikeStrip): SpikeStrip {
    spikeData.handle = native.createObjectNoOffset(spikeModel, spikeData.pos.x, spikeData.pos.y, spikeData.pos.z, true, true, false);
    native.setEntityRotation(spikeData.handle, 0, 0, spikeData.rot.z, 2, false);
    native.placeObjectOnGroundProperly(spikeData.handle);
    return spikeData;
}

function checkSpikes() {
    const player = alt.Player.local;
    if (!native.isPedInAnyVehicle(player.scriptID, false)) return;
    const vehicle = native.getVehiclePedIsIn(player.scriptID, false);
    const coords = native.getEntityCoords(vehicle, false);
    if (!native.doesObjectOfTypeExistAtCoords(coords.x, coords.y, coords.z, 0.9, spikeModel, true)) return;
    native.setVehicleTyreBurst(vehicle, 0, true, 1000);
    native.setVehicleTyreBurst(vehicle, 1, true, 1000);
    native.setVehicleTyreBurst(vehicle, 2, true, 1000);
    native.setVehicleTyreBurst(vehicle, 3, true, 1000);
    native.setVehicleTyreBurst(vehicle, 4, true, 1000);
    native.setVehicleTyreBurst(vehicle, 5, true, 1000);
    native.setVehicleTyreBurst(vehicle, 6, true, 1000);
    native.setVehicleTyreBurst(vehicle, 7, true, 1000);
}

export class SpikeManager {
    static append(spikeData: SpikeStrip): SpikeStrip {
        const spikes = create(spikeData);
        addedSpikes.push(spikes);
        return spikes;
    }

    static populate(spikeList: Array<SpikeStrip>) {
        for (let i = 0; i < spikeList.length; i++) {
            const spikeData = spikeList[i];
            const spikes = create(spikeData);
            addedSpikes.push(spikes);
        }
    }

    static remove(uid: string) {
        const index = addedSpikes.findIndex((x) => x.uid === uid);
        if (index <= -1) return;
        const spikes = addedSpikes[index];
        addedSpikes.splice(index, 1);
        if (!spikes) return;
        native.deleteObject(spikes.handle);
    }
}

alt.onServer(SystemEvent.Ticks_Start, () => alt.setInterval(checkSpikes, 1000)); // send when player has loaded all nessecary things before activate the timer
alt.onServer('spikes:Populate', SpikeManager.populate); //send when player joined server and loggedin
alt.onServer('spikes:Append', SpikeManager.append); //send when player creates a spikestrip serverside
alt.onServer('spikes:Remove', SpikeManager.remove); //send when player removes a spikestrip serverside
