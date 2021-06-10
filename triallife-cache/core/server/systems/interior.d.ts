/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Interior } from '../../shared/interfaces/Interior';
interface InteriorInfo {
    interior: Interior;
    isInside: boolean;
}
export declare class InteriorController {
    static load(): Promise<void>;
    static populate(interior: Interior): void;
    static create(ownerIdentification: string, interior: Interior): Promise<Interior | boolean>;
    static remove(interiorID: string): Promise<boolean>;
    static isOwner(player: alt.Player, interior: Interior): boolean;
    static isOwnerByID(playerID: string, interior: Interior): boolean;
    static hasAccess(player: alt.Player, interior: Interior): boolean;
    static hasFactionAccess(player: alt.Player): boolean;
    static findClosestInterior(player: alt.Player): InteriorInfo | null;
    static switchLocation(player: alt.Player, interior: Interior): boolean;
    static trySwitch(player: alt.Player, pos: alt.IVector3): void;
}
export {};
