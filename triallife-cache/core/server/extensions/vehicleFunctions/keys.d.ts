import * as alt from 'alt-server';
declare function give(veh: alt.Vehicle, target: alt.Player): boolean;
declare function has(veh: alt.Vehicle, target: alt.Player): boolean;
declare function remove(veh: alt.Vehicle, target: alt.Player): boolean;
declare const _default: {
    give: typeof give;
    has: typeof has;
    remove: typeof remove;
};
export default _default;
