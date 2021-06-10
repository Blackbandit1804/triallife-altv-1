import * as alt from 'alt-server';
import { Vehicle_Lock_State } from '../../../shared/utility/enums';
declare function lockState(v: alt.Vehicle): Vehicle_Lock_State;
declare function hasFuel(v: alt.Vehicle): boolean;
declare function isOwner(v: alt.Vehicle, target: alt.Player): boolean;
declare const _default: {
    isOwner: typeof isOwner;
    lockState: typeof lockState;
    hasFuel: typeof hasFuel;
};
export default _default;
