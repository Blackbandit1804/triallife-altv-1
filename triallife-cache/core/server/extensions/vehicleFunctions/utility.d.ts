import * as alt from 'alt-server';
import { Vehicle_Seat_List } from '../../../shared/utility/enums';
declare function eject(v: alt.Vehicle, player: alt.Player): void;
declare function repair(v: alt.Vehicle): void;
declare function warpInto(v: alt.Vehicle, player: alt.Player, seat: Vehicle_Seat_List): void;
declare const _default: {
    eject: typeof eject;
    repair: typeof repair;
    warpInto: typeof warpInto;
};
export default _default;
