import * as alt from 'alt-server';
import { DoorList, VehicleEvent, SeatList } from '../../../shared/enums/vehicle';
import { TlrpVehicleEvent } from '../../enums/tlrp';
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
    setter.doorOpen(v, null, DoorList.HOOD, false, true);
    alt.emit(TlrpVehicleEvent.REPAIRED, v);
}

function warpInto(v: alt.Vehicle, player: alt.Player, seat: SeatList): void {
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

        alt.emitClient(player, VehicleEvent.SET_INTO, v, seat);
    });
}

export default {
    eject,
    repair,
    warpInto
};
