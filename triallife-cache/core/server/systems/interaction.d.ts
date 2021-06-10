/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';
import { Blip } from '../../shared/interfaces/blip';
import '../views/atm';
interface InteractionHelper {
    [key: string]: Array<alt.Colshape>;
}
interface InteractionDefault {
    eventName: string;
    isServer: boolean;
    maxRadius?: number;
    text?: string;
}
export declare class InteractionController {
    static Interactions: InteractionHelper;
    static InteractionTypes: {
        [key: string]: InteractionDefault;
    };
    static generateInteractions(): void;
    static addInteraction(identifierAndEventName: string, position: alt.IVector3, range: number, activationText: string, blip: Blip, isServerEvent: boolean): void;
    static sideLoadInteraction(identifier: string, eventName: string, isServer: boolean, shape: alt.Colshape): void;
    static handleEnterInteraction(colshape: alt.Colshape, player: alt.Entity): void;
    static handleLeaveInteraction(colshape: alt.Colshape, player: alt.Entity): void;
    static handleInteraction(player: alt.Player, type: string): void;
    static populateCustomInteractions(player: alt.Player): void;
}
export {};
