/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
declare function getPositionFrontOf(p: alt.Player, distance: number): alt.Vector3;
declare function getDistanceTo2D(p: alt.Player, position: alt.Vector3): number;
declare function getDistanceTo3D(p: alt.Player, position: alt.Vector3): number;
declare function getVehicleInFrontOf(p: alt.Player, distance: number): alt.Vehicle | null;
declare function getPlayerInFrontOf(p: alt.Player, distance: number): alt.Player | null;
declare function getClosestPlayers(p: alt.Player, distance: number): Array<alt.Player>;
declare const _default: {
    getClosestPlayers: typeof getClosestPlayers;
    getDistanceTo2D: typeof getDistanceTo2D;
    getDistanceTo3D: typeof getDistanceTo3D;
    getPlayerInFrontOf: typeof getPlayerInFrontOf;
    getPositionFrontOf: typeof getPositionFrontOf;
    getVehicleInFrontOf: typeof getVehicleInFrontOf;
};
export default _default;
