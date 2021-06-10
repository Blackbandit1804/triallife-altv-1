/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
export declare function distance(vector1: alt.IVector3, vector2: alt.IVector3): number;
export declare function distance2d(vector1: alt.IVector3, vector2: alt.IVector3): number;
export declare function getForwardVector(rot: alt.Vector3): alt.Vector3;
export declare function getVectorInFrontOfPlayer(player: alt.Player, distance: number): alt.Vector3;
export declare function isBetweenVectors(pos: any, vector1: any, vector2: any): boolean;
export declare function getClosestEntity<T>(playerPosition: alt.Vector3, rot: alt.Vector3, entities: Array<{
    pos: alt.Vector3;
    valid?: boolean;
}>, distance: number): T | null;
