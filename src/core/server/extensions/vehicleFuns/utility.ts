import * as alt from 'alt-server';
import { VehicleDoorList, VehicleEvents, VehicleSeatList } from '../../../shared/utility/enums';
import { TlrpEvent } from '../../utility/enums';
import { playerFuncs } from '../Player';
import setter from './setter';

function eject(v: alt.Vehicle, player: alt.Player): void {
    if (!player.vehicle || player.vehicle !== v) return;
    playerFuncs.save.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
}

function repair(v: alt.Vehicle): void {
    v.repair();
    setter.doorOpen(v, null, VehicleDoorList.HOOD, false, true);
    alt.emit(TlrpEvent.VEHICLE_REPAIRED, v);
}

function warpInto(v: alt.Vehicle, player: alt.Player, seat: VehicleSeatList): void {
    if (v.driver) return;
    if (v.driver === player) return;
    alt.nextTick(() => {
        if (!player || !player.valid) return;
        alt.emitClient(player, VehicleEvents.SET_INTO, v, seat);
    });
}

export default { eject, repair, warpInto };
