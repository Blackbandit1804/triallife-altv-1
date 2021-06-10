import * as alt from 'alt-server';
import { DoorTypes, VehicleEvents, Vehicle_Seat_List } from '../../../shared/utility/enums';
import { ATHENA_EVENTS_VEHICLE } from '../../enums/athena';
import { playerFuncs } from '../player';
import setter from './setter';

function eject(v: alt.Vehicle, player: alt.Player): void {
    if (!player.vehicle || player.vehicle !== v) {
        return;
    }

    playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
}

function repair(v: alt.Vehicle): void {
    v.repair();
    setter.doorOpen(v, null, DoorTypes.HOOD, false, true);
    alt.emit(ATHENA_EVENTS_VEHICLE.REPAIRED, v);
}

function warpInto(v: alt.Vehicle, player: alt.Player, seat: Vehicle_Seat_List): void {
    if (v.driver) {
        return;
    }

    if (v.driver === player) {
        return;
    }

    alt.nextTick(() => {
        if (!player || !player.valid) {
            return;
        }

        alt.emitClient(player, VehicleEvents.SET_INTO, v, seat);
    });
}

export default {
    eject,
    repair,
    warpInto
};
