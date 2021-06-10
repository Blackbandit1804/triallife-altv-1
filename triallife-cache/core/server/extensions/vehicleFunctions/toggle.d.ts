import * as alt from 'alt-server';
import { Vehicle_Lock_State } from '../../../shared/utility/enums';
declare function lock(vehicle: alt.Vehicle, player: alt.Player, bypass?: boolean): Vehicle_Lock_State;
declare function engine(vehicle: alt.Vehicle, player: alt.Player, bypass?: boolean): void;
declare const _default: {
    engine: typeof engine;
    lock: typeof lock;
};
export default _default;
