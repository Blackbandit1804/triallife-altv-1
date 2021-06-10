import * as alt from 'alt-server';
import { Vehicle_Door_List, Vehicle_Events } from '../../../shared/utility/enums';
import { EVENTS_VEHICLE } from '../../enums';
import { playerFuncs } from '../Player';
import setter from './setter';
function eject(v, player) {
    if (!player.vehicle || player.vehicle !== v)
        return;
    playerFuncs.safe.setPosition(player, player.pos.x, player.pos.y, player.pos.z);
}
function repair(v) {
    v.repair();
    setter.doorOpen(v, null, Vehicle_Door_List.HOOD, false, true);
    alt.emit(EVENTS_VEHICLE.REPAIRED, v);
}
function warpInto(v, player, seat) {
    if (v.driver)
        return;
    if (v.driver === player)
        return;
    alt.nextTick(() => {
        if (!player || !player.valid)
            return;
        alt.emitClient(player, Vehicle_Events.SET_INTO, v, seat);
    });
}
export default {
    eject,
    repair,
    warpInto
};
